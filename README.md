# Slack Auth Service


## Details

A simply service for managing authentication flows for [OAuth Slack flows][].

[OAuth Slack flows]: https://api.slack.com/docs/oauth

## Installation

- Install [Yarn][]
- Run `yarn` (install)
- Create a `.env` file matching the [env config schema][]

[yarn]: https://yarnpkg.com/en/docs/install
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
