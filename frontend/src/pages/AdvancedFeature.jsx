import React from "react";
import Case from "../components/Case";
import { useEffect } from "react";

export default function AdvancedFeature() {
    useEffect(() => {
        document.title = "Advanced Feature";
    }, []);

    return (
        <Case>
            <div className="section-header px-4 tw-rounded-none tw-shadow-md tw-shadow-gray-200 lg:tw-rounded-lg">
                <h1 className="mb-1 tw-text-lg">Advanced Feature</h1>
            </div>

            <div className="section-body">
                <div className="card">
                    <div className="card-body px-0">
                        <h3>Tabel Advanced Feature</h3>
                        <p className="px-4">
                            Lorem ipsum dolor, sit amet consectetur adipisicing
                            elit. Tenetur at asperiores earum officiis
                            reiciendis necessitatibus eos! Nam harum tempore
                            molestias aliquam, qui excepturi similique expedita
                            vitae perferendis voluptatum laudantium vero
                            deleniti laboriosam assumenda impedit repellendus
                            eum, commodi totam! Molestiae ducimus placeat totam
                            nesciunt, perspiciatis dolor mollitia ut saepe cum
                            sunt?
                        </p>
                    </div>
                </div>
            </div>
        </Case>
    );
}
