import { ReactNode } from "react";
import Navbar from "./Navbar";
// import Footer from "./Footer";

interface LayoutProps {
  children?: ReactNode;
}

const Layout = (props: LayoutProps) => {
  return (
    <>
      <Navbar />
      <main className="content">{props.children}</main>
      {/* <Footer /> */}
    </>
  );
};
export default Layout;
