'use client';
import { useEffect, useState } from "react";
import SalesChart from "@/components/custom ui/SalesChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CircleDollarSign, ShoppingBag, UserRound } from "lucide-react";
import axios from "axios";

export default function Dashboard() {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrdersconfirmed, setTotalOrdersconfirmed] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [graphData, setGraphData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('authtoken'); // Retrieve token from localStorage

      try {
        if (!token) {
          console.error("No token found in localStorage");
        }
        // count orders confirmed
        const ordersconfirmedResponse = await axios.get(`${process.env.NEXT_PUBLIC_IPHOST}/StoreAPI/orders/countordersconfirm`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTotalOrdersconfirmed(ordersconfirmedResponse.data.count);
        //count orders
        const ordersResponse = await axios.get(`${process.env.NEXT_PUBLIC_IPHOST}/StoreAPI/orders/countorders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTotalOrders(ordersResponse.data.count);
        //count  orders total renue
        const orderstotalrenueResponse = await axios.get(`${process.env.NEXT_PUBLIC_IPHOST}/StoreAPI/orders/totalprice`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTotalRevenue(orderstotalrenueResponse.data.totalPrice);
        // count customers
        const customersResponse = await axios.get(`${process.env.NEXT_PUBLIC_IPHOST}/StoreAPI/users/countusers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTotalCustomers(customersResponse.data.count);

        // Example static graphData
        setGraphData([
          { name: "Jan", sales: 1000 },
          { name: "Feb", sales: 1200 },
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="px-8 py-10">
      <h1 className="text-3xl font-bold text-[#857B74] drop-shadow-lg">
        Dashboard
      </h1>

      <Separator className="bg-grey-1 my-5" />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Total Revenue</CardTitle>
            <CircleDollarSign className="max-sm:hidden" />
          </CardHeader>
          <CardContent>
            <p className="text-body-bold">{totalRevenue} DZD</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Total Orders confirmed</CardTitle>
            <ShoppingBag className="max-sm:hidden" />
          </CardHeader>
          <CardContent>
            <p className="text-body-bold">{totalOrdersconfirmed}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Total Orders </CardTitle>
            <ShoppingBag className="max-sm:hidden" />
          </CardHeader>
          <CardContent>
            <p className="text-body-bold">{totalOrders}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Total Customers</CardTitle>
            <UserRound className="max-sm:hidden" />
          </CardHeader>
          <CardContent>
            <p className="text-body-bold">{totalCustomers}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-10">
        <CardHeader>
          <CardTitle>Sales Chart (DZD)</CardTitle>
        </CardHeader>
        <CardContent>
          <SalesChart data={graphData} />
        </CardContent>
      </Card>
    </div>
  );
}







// 'use client';
// import SalesChart from "@/components/custom ui/SalesChart";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
// import {
//   getSalesPerMonth,
//   getTotalCustomers,
//   getTotalSales,
//   getTotalorders
// } from "@/lib/actions/actions";
// import { CircleDollarSign, ShoppingBag, UserRound } from "lucide-react";

// export default async function Dashboard() {
//   // const totalRevenue = new Intl.NumberFormat("en-US", {
//   //   style: "currency",
//   //   currency: "DZD",
//   // }).format(Number(productInfo.Price));
//   const totalRevenue = await getTotalorders();
//   // await getTotalSales().then((data) => data.totalRevenue);
//   const totalOrders = await getTotalorders();
//   const totalCustomers =  await getTotalCustomers();
//   const graphData = await getSalesPerMonth();

//   return (
//     <div className="px-8 py-10">
//       <p className="text-heading2-bold">Dashboard</p>
//       <Separator className="bg-grey-1 my-5" />

//       <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
//         <Card>
//           <CardHeader className="flex flex-row justify-between items-center">
//             <CardTitle>Total Revenue</CardTitle>
//             <CircleDollarSign className="max-sm:hidden" />
//           </CardHeader>
//           <CardContent>
//             <p className="text-body-bold"> {totalRevenue} DZD </p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row justify-between items-center">
//             <CardTitle>Total Orders</CardTitle>
//             <ShoppingBag className="max-sm:hidden" />
//           </CardHeader>
//           <CardContent>
//             <p className="text-body-bold">{totalOrders}</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row justify-between items-center">
//             <CardTitle>Total Customer</CardTitle>
//             <UserRound className="max-sm:hidden" />
//           </CardHeader>
//           <CardContent>
//             <p className="text-body-bold">{totalCustomers}</p>
//           </CardContent>
//         </Card>
//       </div>

//       <Card className="mt-10">
//         <CardHeader>
//           <CardTitle>Sales Chart (DZD)</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <SalesChart data={graphData} />
//         </CardContent>
//       </Card>
//     </div>
//   );
// }