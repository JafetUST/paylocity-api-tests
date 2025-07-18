Feature: /Prod/api/Employees/ | get employee by valid and Non-existent ID  

  Scenario: get employee by valid and Non-existent ID /Prod/api/Employees/
    Then Make a 'GET' request to 'Prod/api/Employees/83e2574b-9241-4d47-8620-8b30a2e374bb' with statusCode: '404' using the schema from 'cypress/e2e/cucumber/responses/get_employee_byNonExistentId_response.json'