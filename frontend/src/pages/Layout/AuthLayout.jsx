import { Outlet } from "react-router-dom";

export default function AuthLayout() {
    return (
        <section className="section">
            <div className="container mt-5">
                <Outlet />
            </div>
        </section>
    );
}
