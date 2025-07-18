import 'cypress-iframe'

export const compareTypesWithExpect = (templateObj: any, dataObj: any, path: string = ''): void => {
    // Get the keys of the `templateObj` object
    const keys1: string[] = Object.keys(templateObj);
    const endpoint = Cypress.env("endpoint") || "";
    const method = Cypress.env("method") || "";
    for (const key of keys1) {
        // Check if `dataObj` has the same key as `templateObj`. If not, throw an error.
        if (!dataObj.hasOwnProperty(key)) {
            const erroMessage = {
                msg: `Key "${key}" is missing in the second object at path "${path}"`,
                method: method,
                url: endpoint,
                dataObj
            }
            throw new Error(`${JSON.stringify(erroMessage)}`)
        }
        // Get the types defined in `templateObj`, the corresponding value in `dataObj`, and the type of that value.
        const templateObjType: string | null = templateObj[key];
        const dataObjValue: any = dataObj[key];
        const dataObjType: string = dataObjValue !== null ? typeof dataObjValue : 'null';
        const allowedTypes = ['string', 'number', 'boolean'];

        // If the type of `dataObjValue` is "object" and not an array, recursively call `compareTypesWithExpect`.
        // If the type of `dataObjValue` is an array, iterate over the elements of the array and recursively call `compareTypesWithExpect`.
        // If the type of `dataObjValue` is neither an object nor an array, check that the type of `dataObjValue` matches the type defined in `templateObj`.
        if (dataObjType === 'object' && !Array.isArray(dataObjValue)) {
            if (typeof templateObjType === "object" && Object.keys(dataObj[key]).length > 0) {
                compareTypesWithExpect(templateObj[key], dataObj[key], `${path}.${key}`);
            } else if (templateObjType !== null) {
                expect(dataObjValue).to.be.an('object', `Type mismatch at path "${path}.${key}": expected ${templateObjType}, got ${dataObjType}`);
            }
        } else if (Array.isArray(dataObjValue)) {
            if (templateObjType === null) {
                expect(dataObjValue).to.be.an('array', `Type mismatch at path "${path}.${key}": expected ${templateObjType}, got ${dataObjType}`);
            }
            for (let i = 0; i < dataObjValue.length; i++) {
                const value: any = dataObjValue[i];
                const valueType: string = typeof value;

                if (valueType === 'object' && templateObj[key] !== "array")
                    compareTypesWithExpect(templateObj[key][0], value, `${path}.${key}[${i}]`);
                else if (templateObj[key] !== "array")
                    if (templateObjType !== null && !allowedTypes.includes(templateObjType)) {
                        expect(value).to.equal(templateObj[key][0], `Test value "${path}.${key}[${i}]": expected ${templateObj[key][0]}, but got ${value}`);
                    } else {
                        expect(valueType).to.equal(templateObj[key][0], `Type mismatch at path "${path}.${key}[${i}]": expected ${templateObj[key][0]}, but got ${valueType}`);
                    }
            }
        } else {
            if (templateObjType !== null) {
                if (typeof templateObjType === 'string' && templateObjType.startsWith('{{') && templateObjType.endsWith('}}')) {
                    console.log("It is a variable,", key)
                } else {
                    if (templateObjType !== null && !allowedTypes.includes(templateObjType)) {
                        expect(dataObjValue).to.equal(templateObjType, `Type mismatch at path "${path}.${key}": expected ${templateObjType}, got ${dataObjValue}`);
                    } else {
                        expect(dataObjType).to.equal(templateObjType, `Type mismatch at path "${path}.${key}": expected ${templateObjType}, got ${dataObjType}`);
                    }
                }
            } else {
                // Verify both of them are "null"
                expect(dataObjValue, `Type mismatch at path "${path}.${key}"`).to.be.null;
            }
        }
    }
}
