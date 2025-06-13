# Playwright 🎭 Demo project

## About project

This is a *demo* project based on the **Playwirght** framework for creating and running automated tests. It currently includes a pair of *Gov.pl* site GUI tests.

## Project startup

### Requirements

To run the project, you need to install:

- nodejs (**strongly recommended to install `18.20.2` version**)

### Installation

1. Download (clone) this repository to a local folder
2. Navigate to the downloaded project directory
3. Switch to the appropriate branch (command `git checkout <branch_name>`)
4. Install the required libraries and dependencies (command `npm install`, this will install Playwright and others)
5. Install Playwright's *browsers* (command `npx playwright install`; Playwright has its own implementations of browsers that are used for testing)

### Before running

- Reading sensitive data in the project, such as service URLs, login data (username and password, API key etc.), is done using the `dotenv` tool - the data is read from the `.env` file located in the project's root folder. This file is ignored by git for security reasons and is not in the project. It has to be added from another source.

  Example of the `.env` file:

  ```
  NODE_ENV=development

  DEV_BASE_URL=https://www.gov.pl/
  PROD_BASE_URL=https://www.gov.pl/

  WORKERS=1
  ```


### Launching

The most important settings are in the `playwright.config.ts` file. There you can set, for example, the browsers used, or the base URL. Details of the settings can be found in the Playwright documentation. In the current version of this project, the Chrome, Firefox and 'WebKit' browsers are enabled, with one worker (that is, it runs one test at a time).

The basic command to run the tests is:

    npx playwright test

It can take different arguments and parameters - see Playwright's documentation for details.

In the `package.json` file, the `scripts` field contains *predefined* scripts. These are aliases for longer configurations of run commands. They must be specified as an argument to the `npm run` command, and so are possible:
        
- Run tests by specifying the tag `<tag_name>`:

        npm run test-tag --tag='<tag_name>'

    For example, running the command `npm run test-tag --tag='@tabs'` will run only those tests whose tag is specified as `@tabs`. If the specified tag is not assigned to any of tests, nothing will run.

<br/>

- Run all tests in 'headed' mode (visible browsers):

        npm run test

<br/>

- Run all tests in 'non-headed' mode (invisible browsers):

        npm run test-headless

<br/>
 
 ### Other tools and libraries

 This project includes some additional tools and libraries:

 - **dotenv** - as mentioned earlier, used for storing sensitive data
 - **Prettier** - library used for managing code styling and rules. All the configuration is stored in `.prettierrc` file.
 