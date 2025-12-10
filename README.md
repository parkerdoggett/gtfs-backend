# GTFS Backend

Using expressjs and gtfs-realtime-bindings this application pulls static and realtime data from the Halifax Open Data Portal. This backend was created for NSCC's INET 2005 course and compliments the final project for INET 2005, PROG 2100, and PROG 2200.

### Setup Instructions

First you need to populate your MongoDB with the static data:

1. Create your `.env` with `PORT` and `MONGODB_URI`, save it to the /server directory.
2. Run `npm install`.
3. Run `node server/importStatic.js`

Then to run the server:

Using Docker:

1. Run `docker build -t gtfs-backend .` in the root.
2. Create your `.env` with `PORT` and `MONGODB_URI`.
3. Run `docker run -d -p 80:8080 --env-file server/.env gtfs-backend`

Using node:

1. Run `npm install`.
2. Create your `.env` with `PORT` and `MONGODB_URI`, save it in the /server directory.
3. Run `node server/server.js`.

If you want to modify the realtime GTFS URLs you can do so in the server/gtfs.js file.

Licensed under the MIT License.
