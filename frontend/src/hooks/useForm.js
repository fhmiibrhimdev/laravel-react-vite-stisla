import { useState } from "react";

/**
 * Manages form state, validation, and reset.
 *
 * @param {Object} initialValues - The initial form field values
 * @param {Function} validate    - (formData) => { isValid, errors }
 */
export function useForm(initialValues, validate) {
    const [formData, setFormData] = useState(initialValues);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "file" ? files[0] : value,
        }));
        // Clear field error on change
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const isValid = () => {
        if (!validate) return true;
        const result = validate(formData);
        setErrors(result.errors);
        return result.isValid;
    };

    const reset = () => {
        setFormData(initialValues);
        setErrors({});
    };

    const setValues = (values) => {
        setFormData((prev) => ({ ...prev, ...values }));
    };

    return {
        formData,
        errors,
        handleChange,
        isValid,
        reset,
        setValues,
        setFormData,
        setErrors,
    };
}
