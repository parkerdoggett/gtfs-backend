/*
File is to be run using node importStatic.js once to populate the MongoDB database

this was needed as the npm package 'gtfs' only support importing to sqlite and not mongodb (and I decided to be difficult and use mongodb anyway)

this will only have to be run once unless Halfiax Transit updates their GTFS data
*/
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');
const unzipper = require('unzipper');
const mongoose = require('mongoose');
const fetch = require('node-fetch').default;
const fsPromises = fs.promises;

const GTFS_ZIP_URL = 'https://gtfs.halifax.ca/static/google_transit.zip';
const DB_URL = process.env.MONGODB_URI;
const DOWNLOAD_PATH = path.join(__dirname, 'temp_gtfs.zip');
const UNZIPPED_DIR = path.join(__dirname, 'unzipped_gtfs');
// collection prefix incase I implement multi agency support later
const COLLECTION_PREFIX = 'halifax_';
const CORE_FILES = ['routes.txt', 'trips.txt', 'stops.txt', 'stop_times.txt', 'calendar.txt'];

async function downloadZip() {
    console.log('downloading GTFS zip file...');

    await fsPromises.mkdir(path.dirname(DOWNLOAD_PATH), { recursive: true });

    const response = await fetch(GTFS_ZIP_URL);
    if (!response.ok) {
        throw new Error(`Failed to download GTFS zip file: ${response.statusText}`);
    }

    const fileStream = fs.createWriteStream(DOWNLOAD_PATH);

    await new Promise((resolve, reject) => {
        response.body.pipe(fileStream);
        response.body.on('error', reject);
        fileStream.on('finish', resolve);
    });
}

async function unzipFiles() {
    console.log('unzipping GTFS files...');

    await fsPromises.mkdir(UNZIPPED_DIR, { recursive: true });

    await unzipper.Open.file(DOWNLOAD_PATH)
        .then(d => d.extract({ path: UNZIPPED_DIR }));
}

async function processFile(db, fileName, collectionName) {
    const filePath = path.join(UNZIPPED_DIR, fileName);
    console.log(`processing ${fileName} into ${collectionName}...`);

    const collection = db.collection(collectionName);

    try {
        await collection.drop();
        console.log(`dropped existing collection: ${collectionName}`);
    } catch (err) {
        console.log(`error dropping collection (may not exist): ${err.message}`);
    }

    let bulk = collection.initializeUnorderedBulkOp();
    let recordsCount = 0;

    const parser = fs.createReadStream(filePath).pipe(parse({
        columns: true,
        skip_empty_lines: true
    }));

    for await (const record of parser) {
        if (recordsCount.stop_lat) record.stop_lat = parseFloat(record.stop_lat);
        if (recordsCount.stop_lon) record.stop_lon = parseFloat(record.stop_lon);

        bulk.insert(record);
        recordsCount++;

        if (recordsCount % 5000 === 0) {
            await bulk.execute();
            bulk = collection.initializeUnorderedBulkOp();
        }
    }

    if (bulk.length > 0) {
        await bulk.execute();
    }

    const count = await collection.countDocuments();
    console.log(`imported ${count} records into ${collectionName}`);
}

async function importData() {
    console.log('starting static data import...');
    
    try {
        await mongoose.connect(DB_URL);
        console.log('database connected');

        await downloadZip();
        await unzipFiles();

        const db = mongoose.connection.db;

        for (const fileName of CORE_FILES) {
            const collectionName = COLLECTION_PREFIX + fileName.replace('.txt', '');
            await processFile(db, fileName, collectionName);
        }

        console.log('static data import completed successfully');
    } catch (err) {
        console.error(`error during static data import: ${err.message}`);
    } finally {
        await mongoose.connection.close();
    }
}

importData();