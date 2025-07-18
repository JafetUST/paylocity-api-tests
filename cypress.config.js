const fs = require('fs')
const glob = require('glob');
const { defineConfig } = require("cypress");
const webpack = require('@cypress/webpack-preprocessor')
const mime = require('mime-types');
const path = require('path');
const preprocessor = require("@badeball/cypress-cucumber-preprocessor");

const getJsonFromVariables = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(fileContent);
    } else {
      throw new Error(`El archivo no se encuentra: ${filePath}`)
    }
  } catch (e) {
    console.log(`Error: ${e}`);
    return null;
  }
}

let config = {
  taskTimeout: 600000,
  viewportHeight: 200,
  viewportWidth: 200,
  numTestsKeptInMemory: 0,
  redirectionLimit: 50,
  pageLoadTimeout: 150000,
  e2e: {
    experimentalSessionAndOrigin: true,
    failOnStatusCode: false,
    setupNodeEvents,
    chromeWebSecurity: false,
    supportFile: false,
    specPattern: '**/*.feature',
    env: {
      allureReuseAfterSpec: true,
      omitFiltered: true,
      filterSpecs: true
    },
  },
  video: false,
  screenshotOnRunFailure: false,
}

async function setupNodeEvents(on, config) {
  await preprocessor.addCucumberPreprocessorPlugin(on, config);
  on(
    "file:preprocessor",
    webpack({
      webpackOptions: {
        resolve: {
          extensions: [".ts", ".js"],
        },
        module: {
          rules: [
            {
              test: /\.ts$/,
              exclude: [/node_modules/],
              use: [
                {
                  loader: "ts-loader",
                },
              ],
            },
            {
              test: /\.feature$/,
              use: [
                {
                  loader: "@badeball/cypress-cucumber-preprocessor/webpack",
                  options: config,
                },
              ],
            },
          ],
        },
      },
    })
  );

    // Tasks
  on('task', {
    readFileAsInput({ filePath }) {
      return getJsonFromVariables(filePath) || {};
    },
    getMimeType({ fileName }) {
      const mimeType = mime.lookup(fileName);
      return mimeType || 'application/octet-stream'; // Assumes binary if MIME type is not found.  
    }
  });

  return config;
}

module.exports = defineConfig(config);
