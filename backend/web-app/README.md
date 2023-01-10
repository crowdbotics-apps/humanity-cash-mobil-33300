

# Getting started: Frontend

This section outlines instructions on setting up a local development environment for the frontend of your application.

## Installation


After cloning the repo, install the dependencies locally with [Yarn](https://yarnpkg.com/):

```sh
yarn install
```

Create a local env for developement
```sh
cp .env.example .env.development
```

Create a local env for production
```sh
cp .env.example .env.producion
```

Files on the left have more priority than files on the right:
```sh
yarn start: .env.development.local, .env.local, .env.development, .env
yarn build: .env.production.local, .env.local, .env.production, .env
```

Start your frontend in development mode:

```sh
yarn start
```

To create a production build:

```sh
yarn build
```

