import { getDBConnection } from "./database"
import moment from 'moment';



export const getEvent = (eventID?: string): Promise<{ message: string, result?: any }> => {
    return new Promise((resolve, reject) => {
        let connectedDb = getDBConnection();
        let whereEventID: string = ''
        if (eventID) {
            whereEventID = `WHERE events.id = ${eventID}`
        }

        let sql = `SELECT events.id,events.name,events.date,events.isOutside,
        attendees.id AS attendeesID, attendees.name AS attendeesName, attendees.created_at AS attendeesCreatedAt,
        organizers.id AS organizerID, organizers.name AS organizerNAME
        FROM events 
        LEFT JOIN attendees 
        ON events.id = attendees.id
        LEFT JOIN organizers 
        ON events.organizer_id = organizers.id
        ${whereEventID}`;
        connectedDb.all(sql, (err, rows) => {
            if (err) {
                console.error(err.message);
                reject({ message: `Get Event has failed.` });
            } else {
                const newRows = rows.map((row) => {
                    let eachRow = {
                        id: row.id,
                        name: row.name,
                        date: row.date,
                        isOutside: row.isOutside,
                        attendees: [] as { id: string; name: string; created_at: string }[],
                        organizer: {
                            id: row.organizerID,
                            name: row.organizerNAME,
                        }
                    };

                    let attendees: { id: string; name: string; created_at: string }[] = [];

                    if (row.attendeesID) {
                        attendees.push({
                            id: row.attendeesID,
                            name: row.attendeesName,
                            created_at: row.attendeesCreatedAt,
                        });
                    }

                    eachRow.attendees = attendees;

                    return eachRow;
                });

                resolve({
                    message: `Get Event.`,
                    result: newRows
                });
            }
        });
    });
};
