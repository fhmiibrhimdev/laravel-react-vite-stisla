import React from "react";

export default function AuthLayout({ children }) {
    return (
        <>
            <section className="section">
                <div className="container mt-5">{children}</div>
            </section>
        </>
    );
}
