Feature: /Prod/api/Employees/ | Delete employee by ID

  Scenario: delete employee by valid and existent ID /Prod/api/Employees/
    Then Make a 'DELETE' request to 'Prod/api/Employees/d07b2ad1-039a-497d-8e7e-8704d6634c97' with statusCode: '200' using the schema from 'cypress/e2e/cucumber/responses/delete_employee_byId_response.json' 