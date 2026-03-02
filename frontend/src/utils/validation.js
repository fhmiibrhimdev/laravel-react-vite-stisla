/**
 * Validates form data against a set of rules.
 *
 * @param {Object} data  - Form data to validate
 * @param {Object} rules - { fieldName: { required?: string, pattern?: { value: RegExp, message: string } } }
 * @returns {{ isValid: boolean, errors: Object }}
 */
export function validateForm(data, rules) {
    const errors = {};
    let isValid = true;

    for (const [field, fieldRules] of Object.entries(rules)) {
        const value = data[field];

        if (fieldRules.required && !value) {
            isValid = false;
            errors[field] = fieldRules.required;
            continue;
        }

        if (
            fieldRules.pattern &&
            value &&
            !fieldRules.pattern.value.test(value)
        ) {
            isValid = false;
            errors[field] = fieldRules.pattern.message;
            continue;
        }

        if (
            fieldRules.minLength &&
            value &&
            value.length < fieldRules.minLength.value
        ) {
            isValid = false;
            errors[field] = fieldRules.minLength.message;
            continue;
        }

        if (fieldRules.match && value !== data[fieldRules.match.field]) {
            isValid = false;
            errors[field] = fieldRules.match.message;
        }
    }

    return { isValid, errors };
}
