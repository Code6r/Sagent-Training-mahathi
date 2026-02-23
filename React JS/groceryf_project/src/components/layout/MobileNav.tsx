import { NavLink } from "react-router-dom";
import { Home, ShoppingBag, Receipt, User } from "lucide-react";
import { cn } from "@utils/cn";
import { useCart } from "@hooks/useCart";

const MobileNav = () => {
  const { itemCount } = useCart();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur-xl md:hidden">
      <div className="mx-auto flex max-w-md items-center justify-between px-6 py-2.5 text-xs font-medium text-slate-500">
        <NavLink
          to="/"
          className={({ isActive }) =>
            cn(
              "flex flex-1 flex-col items-center gap-0.5",
              isActive && "text-primary-600"
            )
          }
        >
          <Home className="h-5 w-5" />
          <span>Home</span>
        </NavLink>
        <NavLink
          to="/products"
          className={({ isActive }) =>
            cn(
              "flex flex-1 flex-col items-center gap-0.5",
              isActive && "text-primary-600"
            )
          }
        >
          <ShoppingBag className="h-5 w-5" />
          <span>Shop</span>
        </NavLink>
        <NavLink
          to="/orders"
          className={({ isActive }) =>
            cn(
              "relative flex flex-1 flex-col items-center gap-0.5",
              isActive && "text-primary-600"
            )
          }
        >
          <Receipt className="h-5 w-5" />
          <span>Orders</span>
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            cn(
              "relative flex flex-1 flex-col items-center gap-0.5",
              isActive && "text-primary-600"
            )
          }
        >
          <User className="h-5 w-5" />
          <span>Account</span>
          {itemCount > 0 && (
            <span className="absolute -top-1 right-4 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-primary-500 px-0.5 text-[9px] font-semibold text-white">
              {itemCount}
            </span>
          )}
        </NavLink>
      </div>
    </nav>
  );
};

export default MobileNav;

