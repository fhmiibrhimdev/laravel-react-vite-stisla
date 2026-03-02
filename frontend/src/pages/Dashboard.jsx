import Case from "@/components/Case";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function Dashboard() {
    useDocumentTitle("Dashboard");

    return (
        <Case>
            <div className="section-header px-4 tw-rounded-none tw-shadow-md tw-shadow-gray-200 lg:tw-rounded-lg">
                <h1 className="mb-1 tw-text-lg">Dashboard</h1>
            </div>

            <div className="section-body">
                <div className="card">
                    <div className="card-body px-0">
                        <h3>Table Dashboard</h3>
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
