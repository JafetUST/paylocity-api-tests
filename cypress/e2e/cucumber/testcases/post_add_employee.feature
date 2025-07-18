Feature: /Prod/api/Employees/ | POST add new employee

  Scenario: POST add new employee /Prod/api/Employees/
    Then Make a 'POST' request to 'Prod/api/Employees/' with statusCode: '200' using the payload from 'cypress/e2e/cucumber/payload/post_add_employee_payload.json' and the response from 'cypress/e2e/cucumber/responses/post_add_employee_response.json'