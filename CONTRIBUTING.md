# Contributing

We are open to, and grateful for, any contributions made by the community. By contributing to redux-rest-easy, you agree to abide by the [code of conduct](./CODE_OF_CONDUCT.md).

## Reporting Issues and Asking Questions

Before opening an issue, please search the [issue tracker](https://github.com/Brigad/redux-rest-easy/issues) to make sure your issue hasn't already been reported.

## Development

Visit the [Issue tracker](https://github.com/Brigad/redux-rest-easy/issues) to find a list of open issues that need attention.

Fork, then clone the repo:

```bash
git clone https://github.com/your-username/Brigad/redux-rest-easy.git
```

### Building

Running the `build` task will create both a CommonJS module-per-module build and a UMD build.

```bash
yarn build
```

To create just a CommonJS module-per-module build:

```bash
yarn build:commonjs
```

To create just a UMD build:

```bash
yarn build:umd
yarn build:umd:min
```

### Testing and Linting

To run the tests:

```bash
yarn test
```

To continuously watch and run tests, run the following:

```bash
yarn test:watch
```

To perform linting with `eslint`, run the following:

```bash
yarn lint
```

### New Features

Please open an issue with a proposal for a new feature or refactoring before starting on the work. We don't want you to waste your efforts on a pull request resolving an issue which has already been worked on.

You can also have a look at the [list of TODO](./TODO.md).

## Submitting Changes

* Open a new issue in the [Issue tracker](https://github.com/Brigad/redux-rest-easy/issues).
* Fork the repo.
* Create a new feature branch based off the `master` branch.
* Make sure all tests pass and there are no linting errors.
* Submit a pull request, referencing any issues it addresses.

Please try to keep your pull request focused in scope and avoid including unrelated commits.

After you have submitted your pull request, we'll try to get back to you as soon as possible. We may suggest some changes or improvements.

Thank you for contributing!
