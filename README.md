<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>


# NestJS starter

A NestJS starter repository is like a ready-made template for starting a new Node.js project with the NestJS framework. It's a pre-configured codebase that includes essential files, folders, and configurations to accelerate the development process. This repository typically comes with best practices already in place, making it easier for developers to set up a robust and scalable server-side application. It often includes features such as user authentication, database integration, and pre-defined API endpoints, allowing developers to focus on building their application's unique functionality instead of spending time on initial setup.



## Features

- SingUp & SignIn
- Create and refresh JWT token
- User profile and change password
- i18n
- CQRS
- Event Emitter
- Swagger 
- Compodoc
- Gaurds
- ...

## Installation

```bash
$ npm i
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod

# run tests
$ npm run test

# run e2e tests
$ npm run test:e2e

# compodoc
$ npm run compodoc
```

## Postman

You can import Postman collection and environment variables through the files located in the `collections` folder. After import you can update the value of environment variables if needed.

## Artillery
Artillery is an open-source, modern, and powerful performance testing toolkit. It is designed to help developers and testers simulate heavy loads on web applications, APIs, and other services. Artillery allows you to define test scenarios using a simple configuration in YML file, enabling you to simulate various user behaviors, such as making HTTP requests, establishing WebSocket connections, or handling different protocols.

You can see some examples of its usage in the [./Artillery](./artillery) folder.

## Tasks
- [x] E2E tests
  - [x] Jest
  - [x] Postman
- [x] Add docker-compose file