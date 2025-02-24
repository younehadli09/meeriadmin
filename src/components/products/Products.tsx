"use client";

import { Plus } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/custom ui/DataTable";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

import { useEffect, useState } from "react";
import axios from "axios";

interface DataWithId {
    _id: string;
    [key: string]: unknown;
}
export default function Products() {
    const [products, setProducts] = useState<Article[]>([]);
    const router = useRouter();

    useEffect(() => {
        axios
            .post(process.env.NEXT_PUBLIC_IPHOST + "/StoreAPI/products/productGET", {
                query: `
                    query {
                        productGET {
                            _id
                            name
                            description
                            images
                            Price
                            category {
                                name
                            }
                            createdAt
                            updatedAt
                        }
                    }
                `,
            })
            .then((response) => {
                setProducts(response.data.data.productGET);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
            });
    }, []);

    // Define the data type
    interface Article extends DataWithId {
        name: string;
        description: string;
        price: string;
        createdAt: string;
        updatedAt: string;
    }

    // Define your columns
    const columns: ColumnDef<DataWithId, unknown>[] = [
        {
            accessorKey: "name",
            header: "Name",
            cell: (info) => info.getValue() || "N/A",
        },
        {
            accessorKey: "description",
            header: "Description",
            cell: (info) => info.getValue() || "N/A",
        },
        {
            accessorKey: "Price",
            header: "Price",
            cell: (info) => info.getValue() || "N/A",
        },
    ];


    const handleDeleteProduct = async (id: string) => {
        try {
            const token = localStorage.getItem("authtoken");

            await axios.post(
                `${process.env.NEXT_PUBLIC_IPHOST}/StoreAPI/products/productPOST`,
                {
                    query: `
                        mutation {
                            productDELETE(input: {
                                productId: "${id}"
                                password: "younes@"
                            }) {
                                message
                            }
                        }
                    `,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Product deleted successfully!");
            // Optionally, refresh the products list
            setProducts((prev) => prev.filter((product) => product._id !== id));
        } catch (error) {
            console.error("Error deleting product:", error);
            alert("Failed to delete the product. Please try again.");
        }
    };
    const handleUpdateProductAction = async (updatedData: DataWithId) => {
        try { // doka henaya zidi wsh thbi lihaba dirilhom update for example                     description: "${updatedData.description}"

            // okeeyyyy thanks and sorry :( mafi sorry nkhdmo kif kif  testiha ou 9olili 
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_IPHOST}/StoreAPI/products/productPOST`,
                {
                    query: `
                    mutation {
            productUpdate(input: {
                _id: "${updatedData._id}",
                updates: {
                    name: "${updatedData.name}",
                    Price: ${updatedData.Price},
                    CountINStock: ${updatedData.CountINStock}
                    description: "${updatedData.description}"
                    images: "${updatedData.images}"
                }
            }) {
                product {
                    _id
                    name
                    Price
                    CountINStock
                }
                message
            }
        }
                    `,
                },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('authtoken')}` },
                }
            );
            if (response.status === 200) {
                setProducts((prev) =>
                    prev.map((item) => (item._id === updatedData._id ? updatedData as Article : item))
                );
                alert("Product updated successfully!");
            }
        } catch (error) {
            console.error("Error updating collection:", error);
            alert("Failed to update this product. Please try again.");
        }
    };

    return (
        <div>
            <div className="flex items-center px-8 py-10 xl:mx-10 justify-between">
                <h1 className="lg:text-4xl text-3xl font-bold text-[#857B74] drop-shadow-lg">
                    Products
                </h1>

                <Button
                    className="btn-primary hover:bg-custom-beige"
                    onClick={() => router.push("/products/newproduct")}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    new product
                </Button>
            </div>
            <DataTable<DataWithId, unknown>
                columns={columns as ColumnDef<DataWithId, unknown>[]}
                data={products}
                searchKey="name"
                editLinkBase="/collections/edit"
                onDeleteAction={handleDeleteProduct}
                onUpdateAction={handleUpdateProductAction}
            />



        </div>
    );
}
