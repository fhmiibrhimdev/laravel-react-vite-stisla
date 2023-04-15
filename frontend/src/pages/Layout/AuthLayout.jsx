import React from "react";

export default function MainLayout({ children }) {
    return (
        <>
            <div id="app">
                <section class="section">
                    <div class="container mt-5">{children}</div>
                </section>
            </div>
        </>
    );
}
