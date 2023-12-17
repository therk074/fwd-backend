import { getDBConnection } from "./database"
import moment from 'moment';
const request = require('request');


export const getEvent = async (eventID?: string): Promise<{ message: string, result?: any }> => {
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
        connectedDb.all(sql, async (err, rows) => {
            if (err) {
                console.error(err.message);
                reject({ message: `Get Event has failed.` });
            } else {
                const newRows = await Promise.all(rows.map(async (row) => {
                    let eachRow = {
                        id: row.id,
                        name: row.name,
                        date: row.date,
                        isOutside: row.isOutside,
                        attendees: [] as { id: string; name: string; created_at: string }[],
                        organizer: {
                            id: row.organizerID,
                            name: row.organizerNAME,
                        },
                        weather: {} as any
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

                    if (eventID) {
                        let currentDate = moment();
                        if (row.date && row.isOutside === 1) {
                            let eventDate = moment(row.date);
                            let dateDifferent = currentDate.diff(eventDate, 'days')
                            let callingWeather:any 
                            if (dateDifferent <= 7) {
                                callingWeather = await getWeather(moment(eventDate).format('YYYY-MM-DD'), moment(eventDate).add(1, 'days').format('YYYY-MM-DD'))
                            }
                            callingWeather ? eachRow.weather = callingWeather :  delete eachRow.weather
                        }
                    }

                    return eachRow;
                }));

                resolve({
                    message: `Get Event.`,
                    result: newRows
                });
            }
        });
    });
};


const getWeather = async (eventDate: any, currentDate: any) => {
    const WeatherbitApiKey = '4e4cd371c9ff484db88871a12f4146a3'
    const weatherURL = `https://api.weatherbit.io/v2.0/history/subhourly?lat=13.736717&lon=100.523186&start_date=${eventDate}&end_date=${currentDate}&key=${WeatherbitApiKey}`
    const request = require('request');
    return new Promise((resolve, reject) => {
        request(weatherURL, function (error: any, response: any, body: any) {
            if (error) {
                reject(error);
                return;
            }

            let parseBody: any
            if (body) parseBody = JSON.parse(body)
            console.error('getWeather error:', error);
            console.log('getWeather statusCode:', response && response.statusCode);
            // console.log('getWeather body:', parseBody);

            console.log(parseBody.data[0])

            if (response.statusCode === 200 && body) {
                resolve({
                    temperatureInDegreesCelcius: parseBody.data[0].app_temp,
                    chanceOfRain: parseBody.data[0].precip_rate
                });
            } else {
                reject(null)
            }
        });
    });
}