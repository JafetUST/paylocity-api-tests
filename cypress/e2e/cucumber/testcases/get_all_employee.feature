Feature: /Prod/api/Employees/ | get all employees

  Scenario: get all employees /Prod/api/Employees/
    Then Make a 'GET' request to 'Prod/api/Employees/' with statusCode: '200' using the schema from 'cypress/e2e/cucumber/responses/get_all_employee_response.json'