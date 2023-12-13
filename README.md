# twitter-clone

Recreation of parts of the official Twitter (now X)
website from scratch, using React with Typescript and pure SCSS.

## Motivation

This project serves as a personal playground to practise front end developing.
It covers the following areas:

- Translation of a given UI design to a dynamic page
- Responsive design
- Interaction with a back end server through an API
- Caching of API results with React Query
- React hooks and component design in a compact and reusable way, to be adopted by multiple places in the codebase
- Typesafe programming with Typescript
- Good programming techniques for code maintainability and readability through a large-scale project

The decision to persist with pure SCSS instead of committing to a specific advanced framework was mainly taken
to deepen the understanding of fundamental CSS like Grid and Flexbox. A solid CSS foundation can permit future adaptation
to any framework.

## Sample screens

## Back end

While this is a front end oriented project, a backend end was additionally developed in order to
test API interaction and caching, which uses Node, Express and MySQL. The back end does not
necessarily follow the most up to date back end-specific programming guidelines in terms of security and maintainability,
as the main focus of this project is front end work.

## Main features

The following main features are currently included in this version of Twitter:

- Account registration & login with form validation
- Post Tweets, reply, retweet, and like a Tweets
- Infinite scrolling timeline with caching and background requests for newer tweets
- Profile customization
- View user profile and tweet activity
- Follow / unfollow users
- UI elements like dropdown menus, sticky side bars, popups, modals

## How to run

Assuming Docker and Docker Compose are installed on your system:
Run
`docker compose up` on the project's root folder.
After installation, Twitter will be available in <a>http://localhost:4173/</a>.

On the first installation, Twitter's database is populated with randomly generated data through [faker](https://fakerjs.dev/),
and the database is filled with tweet activity and friendships between users, to simulate a more realistic
environment.

A default user with the username
`user123` is always included. The password of all users is `12345678`, to allow logging in as any user
for testing purposes.
During registration, there is no need to provide a real email address, as the verification code
step is mocked.

To stop the process, run `docker compose stop` in another terminal, or press `Ctrl+C` (on Linux) within the process.
By default, any changes will be persisted to the Twitter database. To reset it to
its initial state, run `docker compose down --volumes`.

## Disclaimer

This work is meant for educational purposes only, as its purpose is to
hone personal web developing skills. No financial profit is made from it.
