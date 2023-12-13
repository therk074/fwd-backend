# Join FWD - the coding challenge

## Introduction

Hi! If you're reading this then it's because you're in the interview process with us at FWD and have been invited to
complete the coding challenge as a **Backend Engineer**. Congratulations! 🎉

This coding challenge is designed to assess your ability to write code while giving you the freedom to express yourself and show off
what you consider to be best practices.

## Submission

1. Fork the repository
2. Finalize the code challenge
3. Commit all your changes
4. Share the link of your repository

## Setup

This repository contains the skeleton of a NodeJS Express app in TypeScript and an SQLite database, to which you will add functionality. The code here was built for node version 14.

The first step is to run `npm i` to install the required dependencies.

A handful of scripts are provided:

`npm run build` will build the application

`npm run start` will start the application 

`npm run test` will run the tests.


## The scenario

You are a building a new RESTful API to manage events which are currently organized by hand and this is proving unwieldly.
The first iteration of the solution is to build a REST API to get a list of events.

### Requirements

#### The Data

The data are in the SQLlite database located in `data/myDb.db`

#### The API

Create the API following the contracts below:

`GET /events`

Retrieve upcoming events, the endpoint must accept the following query parameters:

- `from`: optional, Date, defaults ot the current time, only return events after this date
- `until`: optional, Date, if omitted return all future events

The required response is:

```
{
    results: [
        {
            id: <unique identifier of event in our system>,
            name: string,
            date: Date,
            isOutside: boolean
            attendees: [] // empty array is fine for first iteration
            organizer: {
                id: <unique identifier of organizer in our system>,
                name: string
            },
        }
    ]
}
```

In addition, the results must be paginated, the specifics of the pagination are left up to you to decide.

`GET /events/{eventId}`

Retrieve details for an upcoming event

```
{
    id: <unique identifier of event in our system>,
    name: string,
    date: Date,
    isOutside: boolean
    attandees: [] // empty array is fine for first iteration
    organizer: {
        id: <unique identifier of organizer in our system>,
        name: string
    },
    // if an event is outside and occuring withing 7 days, call any weather api to get the following details
    // if an event is not outside, or not occuring within 7 days this should be null
    weather: null || {
        temperatureInDegreesCelcius: number,
        chanceOfRain: number 0-100
    }
}
```

# Tips

Because the slate is blank, you will be making a lot of decisions about how the app should work, it's a good idea to document these decisions, as you will very likely be asked about them in the follow-up.


# Assessment
Overall quality over feature-completeness. The challenge is intentionally kept very open to provide you with enough freedom to make your own decisions and creatitivy. If you don't get to work on everything, outline what the next steps would look like and how you'd approach it. 

We will assess your solution based on following criteria:

- **Clarity**
Comments, documentation, naming conventions

- **Correctness**
Does it work as intended

- **Code Quality**
Any code smells, red flags? OOO vs functional, SOLID, consistent code

- **Security**
Any vulnerabilities e.g. input validations, error handling

- **Testing**
Unit tests, do they exist, do they run?

- **Product readiness**
Can it be used in production? What might be missing?


# FAQ

Can I use a different tech stack?
> You have the freedom to use different frameworks and libraries but `Typescript` remains a hard requirement as it is our primary programming language and you'll be working with it every day.


