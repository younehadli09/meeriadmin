
import CollectionForm from "@/components/collections/CollectionForm"
import Layout from "@/app/(Dashboard)/layout";


export default function CreateCollection() {
    return (
        <div className="flex  w-full ">
            <Layout>
                <div className="flex justify-center">
                    <CollectionForm />
                </div>
            </Layout>
        </div>
    );
}