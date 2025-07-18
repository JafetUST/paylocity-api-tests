Feature: /Prod/api/Employees/ | get employee by valid and existent ID

  Scenario: get employee by valid and existent ID /Prod/api/Employees/
    Then Make a 'GET' request to 'Prod/api/Employees/83e2574b-9241-4d47-8620-8b30a2e374aa' with statusCode: '200' using the schema from 'cypress/e2e/cucumber/responses/get_employee_byId_response.json'