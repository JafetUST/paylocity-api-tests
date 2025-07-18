import 'cypress-iframe'
import { Before, When, Then, After, Given } from '@badeball/cypress-cucumber-preprocessor'
import { compareTypesWithExpect } from '../../plugins/support/auxiliar'
const url = "https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/";
const token = "Basic VGVzdFVzZXI3NTc6TyFoRXxaSmdSXTNY"

const GenericRequestWithSchemaAndPayload = (method: string, urlFromTestCase: string, statusCode: string, filePathPayload: string, filePathResponse: string): void => {
    cy.log("endpoint", url);
    cy.log("method", method);
    // Read the data that will be sent in the post request
    cy.task('readFileAsInput', { filePath: filePathPayload }).then((objectData: any): void => {
        if (Object.keys(objectData).length === 0) {
            objectData = null;
        }
        // Read the schema that will be used to validate the response
        cy.task('readFileAsInput', { filePath: filePathResponse }).then((objectSchema: any): void => {
            if (Object.keys(objectSchema).length === 0) {
                // Theres a error with the path
                throw new Error(`ERROR: Please verify the path of the SCHEMA FILE or the content: ${filePathResponse}`)
            }
            cy.wrap({ data: objectData, schema: objectSchema }).as("objectsForRequest");
        });
    });
    cy.get("@objectsForRequest").then((objectsForRequest): void => {
        const { data, schema }: any = objectsForRequest;
        if (Object.keys(schema).length > 0) {
            cy.request({
                method: method,
                url: url + urlFromTestCase,
                timeout: 300000,
                body: data,
                headers: { Authorization: token }
            }).then((response): void => {
                console.log("Response", response)
                expect(response, 'Response contains status and body').to.include.keys('status', 'body');
                if (response.status === Number.parseInt(statusCode)) {
                    expect(response.status, `Response status is ${statusCode}`).to.equal(Number.parseInt(statusCode));
                    if (response.body.hasOwnProperty('Error') === false) {
                        // Review the response's body
                        compareTypesWithExpect(schema, response.body);
                        cy.log(`Duration of request: ${response.duration}`)
                    } else {
                        const erroMessage = {
                            msg: "has Error Property",
                            code: response.status,
                            method: method,
                            url: url,
                            body: response.body ?? ""
                        }
                        throw new Error(`${JSON.stringify(erroMessage)}`)
                    }

                } else {
                    cy.log("ERROR: StatusCode failed")
                    const erroMessage = {
                        msg: "StatusCode failed",
                        code: response.status,
                        method: method,
                        url: url,
                        body: response.body ?? "",
                        expectedStatusCode: statusCode
                    }
                    throw new Error(`${JSON.stringify(erroMessage)}`)
                }
            });
        }
    })
}

Then('Make a {string} request to {string} with statusCode: {string} using the payload from {string} and the response from {string}',
    (method: string, urlFromTestCase: string, statusCode: string, filePathData: string, filePathSchema: string): void => {
        GenericRequestWithSchemaAndPayload(method, urlFromTestCase, statusCode, filePathData, filePathSchema)
    })

Then('Make a {string} request to {string} with statusCode: {string} using the schema from {string}',
    (method: string, urlFromTestCase: string, statusCode: string, filePathSchema: string): void => {
        cy.log("endpoint", url);
        cy.log("method", method);
        // Read the schema file
        cy.task('readFileAsInput', { filePath: filePathSchema }).then((objectSchema: any): void => {
            if (Object.keys(objectSchema).length === 0) {
                // Theres a error with the path
                throw new Error(`ERROR: Please verify the path of the SCHEMA FILE or the content: ${filePathSchema}`)
            } else {
                // Send request
                cy.request({
                    method: method,
                    url: url + urlFromTestCase,
                    headers: { Authorization: token },
                    timeout: 300000
                }).then((response): void => {
                    console.log("RESPONSE RECIVED: ");
                    console.log(response.body);
                    // Verify if the answer has status and body
                    expect(response, 'Response contains status and body').to.include.keys('status', 'body');
                    // Review of reponse's content
                    if (response.status === Number.parseInt(statusCode)) {
                        expect(response.status, `Response status is ${statusCode}`).to.equal(Number.parseInt(statusCode));
                        if (response.body.hasOwnProperty('Error') === false) {
                            // Review the response's body
                            compareTypesWithExpect(objectSchema, response.body);
                            cy.log(`Duration of request: ${response.duration}`)
                        } else {
                            const erroMessage = {
                                msg: "has Error Property",
                                code: response.status,
                                method: method,
                                url: url,
                                body: response.body ?? ""
                            }
                            throw new Error(`${JSON.stringify(erroMessage)}`)
                        }
                    } else {
                        cy.log("ERROR: StatusCode failed")
                        const erroMessage = {
                            msg: "StatusCode failed",
                            code: response.status,
                            method: method,
                            url: url,
                            body: response.body ?? "",
                            expectedStatusCode: statusCode
                        }
                        throw new Error(`${JSON.stringify(erroMessage)}`)
                    }
                });
            }
        });
    })