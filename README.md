# Author: Jafet Uriel Sánchez Torres
# Cypress API Tests
This project contains automated tests for the Paylocity Dashboard Benefits API using Cypress and Cucumber.

## Installation
1. Install dependencies:
```bash
npm install
```

2. Open Cypress:
```bash
npx cypress open
```

## Run Tests
Run all feature files:
```bash
npm run test
```

## Folder Structure
- `cypress/e2e/cucumber/testcases`: Feature files
- `cypress/e2e/cucumber/payload`: Payloads files
- `cypress/e2e/cucumber/responses`: Responses files
- `cypress/e2e/cucumber/genericSteps.ts`: Step definitions.

## Validations/Asserts
- Status code – Ensures the correct HTTP response code is returned (e.g., 200, 404, 201).
- Response structure – Validates the expected shape of the JSON object (keys, nested objects, arrays).
- Data types – Confirms fields have the expected types (e.g., string, number, boolean).
- If has error properties - Check if the response has error propierties.

## Test cases
- Get all employees
- Get employee by ID
- Get employee by nonexistent ID
- Add employee
- Update employee
- Delete employee