import { join } from "path"
import { Database } from "sqlite3"

let db: Database

export const dbLocation = join(__dirname, '../data/myDb.db')

export const getDBConnection = (): Database => {

    if (!db) {
        const sqlite3 = require('sqlite3').verbose();
        db = new sqlite3.Database(dbLocation, (err: any) => {
            if (err) {
                return console.error(err.message);
            }
            console.log('Connected to the in-memory SQlite database.');
        });

        // db.close((err) => {
        //     if (err) {
        //         return console.error(err.message);
        //     }
        //     console.log('Close the database connection.');
        // });
    }
    return db
}
