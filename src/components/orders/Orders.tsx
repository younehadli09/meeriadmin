'use client';
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/custom ui/DataTable";
import { useEffect, useState } from "react";
import axios from "axios";

interface DataWithId {
    _id: string;
    [key: string]: unknown;
}



interface Order extends DataWithId {
    idorder: string;
    adress: string;
    wilaya: string;
    commune: string;
    phonenumber: string;
    status: string;
    totalprice: string;
    quantityOrder: number;
    user: {
        _id: string;
        username: string;
    };
    dateordered: string;
    createdAt: string;
    updatedAt: string;
    orderitems: OrderItem[];
    [key: string]: unknown;
}

interface OrderItem {
    _id: string;
    quantity: number;
    product: {
        name: string;
        images: string[];
        Price: number;
    };
    size: string;
    color: string;
    priceproduct: string;
    createdAt: string;
    updatedAt: string;
}

export default function Orders() {
    const [orders, setOrders] = useState<Order[]>([]);


    useEffect(() => {
        const handleOrder = async () => {
            try {
                const token = localStorage.getItem("authtoken");
                const response = await axios.post(
                    process.env.NEXT_PUBLIC_IPHOST + "/StoreAPI/orders/orderGET",
                    {
                        query: `
                            query {
                                userorderGET {
                                    order {
                                        _id
                                        idorder
                                        orderitems {
                                            _id
                                            quantity
                                            product {
                                                name
                                                images
                                                Price
                                            }
                                            size
                                            color
                                            priceproduct
                                            createdAt
                                            updatedAt
                                        }
                                        adress
                                        wilaya
                                        commune
                                        phonenumber
                                        status
                                        totalprice
                                        quantityOrder
                                        user {
                                            _id
                                            username
                                        }
                                        dateordered
                                        createdAt
                                        updatedAt
                                    }
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

                if (response.data?.data?.userorderGET?.order) {
                    // Map both _id and id for compatibility
                    const mappedOrders = response.data.data.userorderGET.order.map((order: OrderType) => ({
                        ...order,
                        id: order._id,
                        _id: order._id,
                    }));
                    setOrders(mappedOrders);
                } else {
                    console.error("No orders found");
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };

        handleOrder();
    }, []);




    const columns: ColumnDef<Order>[] = [

        {
            accessorKey: "user.username",
            header: "Ordered By",
            cell: (info) => info.getValue() || "N/A",
        },

        {
            accessorKey: "totalprice",
            header: "Total",
            cell: (info) => info.getValue() || "N/A",
        },
        {
            accessorKey: "status",
            header: "State",
            cell: (info) => info.getValue() || "N/A",
        },
        {
            accessorKey: "dateordered",
            header: "Ordered At",
            cell: (info) => info.getValue() || "N/A",
        },
    ];

    const handleDeleteProduct = async () => {

    };

    return (
        <div className="px-8 py-10 xl:mx-10 ">
            <div className="flex items-center justify-between">
                <h1 className="lg:text-4xl text-3xl font-bold text-[#857B74] drop-shadow-lg">
                    Orders
                </h1>
            </div>
            <DataTable<Order, unknown>
                columns={columns as ColumnDef<Order, unknown>[]}
                data={orders}
                searchKey="status"
                editLinkBase="/collections/edit"
                onDeleteAction={handleDeleteProduct}
                onUpdateAction={() => { }}

            />


        </div>
    );
}
