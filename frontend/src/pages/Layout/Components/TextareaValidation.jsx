import React from "react";

export default function TextAreaValidation({
    label,
    name,
    value,
    onChange,
    error,
}) {
    return (
        <div className="form-group">
            <label htmlFor={name}>{label}</label>
            <textarea
                name={name}
                id={name}
                className={`form-control ${error ? "is-invalid" : ""}`}
                value={value}
                onChange={onChange}
                style={{ height: 100 }}
            ></textarea>
            {error && <div className="invalid-feedback">{error}</div>}
        </div>
    );
}
