# DataLoom Contributing Guide

## Issues

Issues are somewhat prioritized in the [project roadmap](https://github.com/users/trey-wallis/projects/2). However, you are welcome to work on whatever issue you would like.

If the code you are contributing is related to an existing issue, please make a comment on that issue and tag trey-wallis. This is so that I know that you are working on that it.

## Diagrams

State machines and flowcharts can be found can be found in the `diagrams` folder

## Getting started

Start by cloning the repository

```shell
git clone https://github.com/trey-wallis/obsidian-dataloom.git
```

We use yarn for dependency management instead of npm. Please make sure that you have installed yarn.

```shell
npm install -g yarn
```

Cd to the clone repository

```shell
cd obsidian-dataloom
```

Install dependencies

```shell
yarn install
```

Create a symbolic link from the cloned repository to your Obsidan vault.

Note: I recommend making a new Obsidian vault just for development.

```shell
ln -s <repo-path> <dev-vault-path>/.obsidian/plugins
```

e.g. `ln -s /users/trey/desktop/obsidian-dataloom /users/trey/desktop/test-vault/.obsidian/plugins`

Run esbuild in development mode

```shell
yarn run dev
```

Open your vault in Obsidian

Enable DataLoom

Make a code change

Restart Obsidian to see your code changes

## Tests

Please make [jest](https://jestjs.io/) tests for the code that you create. Please note that some Obsidian functionality is very hard to test due to the library being an external dependency and closed source. If tests cannot be written, your code can be still be accepted. If you need help with writing tests, please DM me on discord.

## Pull requests

Once you have made your changes, make a pull request. Please choose the `dev` branch for the branch that you would like to merge into.

The pull request will be reviewed. Once it is approved, it will be merged into `dev`.
