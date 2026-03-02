import Case from "@/components/Case";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function AdvancedFeature() {
    useDocumentTitle("Advanced Feature");

    return (
        <Case>
            <div className="section-header px-4 tw-rounded-none tw-shadow-md tw-shadow-gray-200 lg:tw-rounded-lg">
                <h1 className="mb-1 tw-text-lg">Advanced Feature</h1>
            </div>

            <div className="section-body">
                <div className="card">
                    <h3>Table Advanced Feature</h3>
                    <div className="card-body px-0">
                        <p className="px-4">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tenetur at asperiores earum officiis reiciendis necessitatibus eos!</p>
                    </div>
                </div>
            </div>
        </Case>
    );
}
