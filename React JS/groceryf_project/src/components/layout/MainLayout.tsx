import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import MobileNav from "./MobileNav";
import CartDrawer from "./CartDrawer";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="app-shell">
      <Header />
      <main className="app-main pb-16 md:pb-0">{children}</main>
      <Footer />
      <MobileNav />
      <CartDrawer />
    </div>
  );
};

export default MainLayout;

