# Slack Auth Service


## Details

A simply service for managing authentication flows for [OAuth Slack flows][].

[OAuth Slack flows]: https://api.slack.com/docs/oauth

## Prerequisites

- [Docker][] installed and running
- [Yarn][] installed

[Docker]: https://docs.docker.com/docker-for-mac/install/
[Yarn]: https://yarnpkg.com/en/docs/install

## Installation

- Run `yarn`
- Create a `.env` file matching the [env config schema][]

[env config schema]: /schema/env.js


## Usage

| Description                                                       | Command               |
|-------------------------------------------------------------------|-----------------------|
| start the server                                                  | `yarn start`          |
| start the server in dev mode (watch files and restart on changes) | `yarn dev`            |
| run tests                                                         | `yarn test`           |
| run matching tests                                                | `yarn test <regex>`   |
| run tests in watch mode                                           | `yarn test --watch`   |
| check for linting errors                                          | `yarn lint`           |
| fix linting errors                                                | `yarn lint:fix`       |


## Features

* Sign in with Slack
* Add to Slack (TODO)
* Delete user (TODO)
