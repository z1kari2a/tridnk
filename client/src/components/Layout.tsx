import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800 font-cairo">
      <Header />
      <main className="container mx-auto px-4 py-6 flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
