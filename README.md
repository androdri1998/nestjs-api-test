# Nest Js Tutorial Project

## Nest Js Learn Project

Based on [You Tube video](https://www.youtube.com/watch?v=GHTA143_b-s)

This is a simple project to learn and practice more about Nest.js and Node.js

## Main Technologies Used

- Nest.js
- Node.js
- Prisma
- Jest

## Main Functionalities

On this application it's possible to create a user, authenticate a user, recover info of created users, and create, recover and delete info of bookmarks related to user.

## Requirements

It's required to run commands bellow to install dependencies and create locally sqlite database to be used on application

```bash
$ npm install
$ npm run db:dev:restart
```

## Commands

### $ npm install

To install project's dependencies

### $ npm run db:dev:restart

Used to clean dev sqlite database, or if dev database it's not created, this command will create a file to be used as a sqlite database to application

### $ npm run start:dev

Used to start application watching changes on code

### $ npm run test:e2e

To run e2e tests, this command will use prisma to create a database with sqlite to execute e2e tests