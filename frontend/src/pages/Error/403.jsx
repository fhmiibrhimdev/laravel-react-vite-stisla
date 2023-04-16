import React from "react";
import { Link } from "react-router-dom";

export default function Error403() {
    return (
        <>
            <div id="app">
                <section class="section">
                    <div class="container mt-5">
                        <div class="page-error">
                            <div class="page-inner">
                                <h1>403</h1>
                                <div class="page-description">
                                    You do not have access to this page.
                                </div>
                                <div class="page-search">
                                    <div class="mt-3">
                                        <Link to="/">Back to Home</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="simple-footer mt-5">
                            Copyright &copy; Stisla 2023
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
