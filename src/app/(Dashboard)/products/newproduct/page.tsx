'use client';
import ProductForm from "@/components/products/ProductForm";

const NewProduct = () => {
    return (
        <>
            <p className="m-6 text-3xl font-bold text-center text-[#857B74] drop-shadow-lg">
                Create New Product
            </p>
            <div className="flex p-6 justify-center items-center">
                <ProductForm initialData={null} />
            </div>
        </>
    );
};

export default NewProduct;
