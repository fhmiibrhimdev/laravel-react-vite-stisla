import { Link } from "react-router-dom";

export default function Error403() {
    return (
        <div id="app">
            <section className="section">
                <div className="container mt-5">
                    <div className="page-error">
                        <div className="page-inner">
                            <h1>403</h1>
                            <div className="page-description">
                                You do not have access to this page.
                            </div>
                            <div className="page-search">
                                <div className="mt-3">
                                    <Link to="/">Back to Home</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="simple-footer mt-5">
                        Copyright &copy; Stisla 2023
                    </div>
                </div>
            </section>
        </div>
    );
}
