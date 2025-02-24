"use client";
import "../globals.css";
import LeftSideBar from "@/components/layout/LeftSideBar";
import TopBar from "@/components/layout/TopBar";
import Signin from "@/components/Signin";
import { useEffect, useState } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authtoken");
    setIsAuthenticated(!!token);
  }, []);

  if (!isAuthenticated) {
    // Render only the Signin component if not authenticated
    return <Signin />;
  }

  // Render the full layout if authenticated
  return (
    <html lang="en">
      <body>
        <div className="flex max-lg:flex-col text-grey-1">
          <LeftSideBar />
          <div className="flex-1">
            <TopBar />
            <div>{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
