// app/layout.tsx or app/layout.js (Server Component)
import "../globals.css";
import LeftSideBar from "@/components/layout/LeftSideBar";
import TopBar from "@/components/layout/TopBar";
import AuthWrapper from "@/components/AuthWrapper";

export const metadata = {
  title: "Merri Admin",
  description: "Merri store admin",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthWrapper>
          <div className="flex max-lg:flex-col text-grey-1">
            <LeftSideBar />
            <div className="flex-1">
              <TopBar />
              {children}
            </div>
          </div>
        </AuthWrapper>
      </body>
    </html>
  );
}
