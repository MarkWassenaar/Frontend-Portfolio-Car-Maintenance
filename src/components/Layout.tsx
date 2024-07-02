import { ReactNode } from "react";

import Footer from "./Footer";
import Navbar from "./Navbar";
interface LayoutProps {
  children?: ReactNode;
}

const Layout = (props: LayoutProps) => {
  return (
    <div className="flex flexbox flex-col min-h-screen">
      <Navbar />
      <main className=" flex-grow">{props.children}</main>
      <Footer />
    </div>
  );
};
export default Layout;
