<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

 <p align="center">A progressive <a href="http://nodejs.org" target="blank">Node.js</a> framework for building efficient and scalable server-side applications, heavily inspired by <a href="https://angular.io" target="blank">Angular</a>. This template helps you start new applications, as used by Developer Latam.</p>

<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/dm/@nestjs/core.svg" alt="NPM Downloads" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#5" alt="Coverage" /></a>
<a href="https://gitter.im/nestjs/nestjs?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=body_badge"><img src="https://badges.gitter.im/nestjs/nestjs.svg" alt="Gitter" /></a>
<a href="https://opencollective.com/nest#backer"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>

</p>

## Description and Features

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository. It includes the following:

- ESLint and Prettier configured
- Conventional Commits (https://www.conventionalcommits.org/)
- Logger Pino (https://github.com/iamolegga/nestjs-pino)
- Swagger
- Husky (https://github.com/typicode/husky#readme)
- Typegoose and Mongoose (https://github.com/typegoose/typegoose)

## Warning

- Never use --no-verify when committing
- Never turn off eslint or prettier rules
- Never modify DockerFile and .gitlab-ci.yml files

## Installation

- `yarn`

## Running the app

First, copy the `.env.example` file to `.env` and fill out your environment variables

- `yarn start:dev`

## Running test

```bash
# unit tests
$ yarn test

# force arch
$ env MONGOMS_ARCH=x64  yarn test

# test coverage
$ yarn test:cov
```

### Git / Hocks

When making a commit, the husky tool analyzes your code and looks for errors of the type eslint and prettier, and then validates the commit message

```bash
  'pre-commit': 'lint-staged'
  'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS'
```

### Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).
