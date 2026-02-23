import { Link, NavLink, useLocation } from "react-router-dom";
import { ShoppingCart, User, Search, Package2, Leaf } from "lucide-react";
import { useCart } from "@hooks/useCart";
import { useAuth } from "@hooks/useAuth";
import Button from "@components/ui/button";
import Input from "@components/ui/input";
import { APP_NAME } from "@utils/constants";
import { cn } from "@utils/cn";

const Header = () => {
  const { itemCount, toggleCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  const showSearch =
    location.pathname === "/" || location.pathname.startsWith("/products");

  return (
    <header className="sticky top-0 z-30 border-b border-primary-50/80 bg-gradient-to-b from-white/95 via-white/90 to-white/80 backdrop-blur-xl">
      <div className="container-wide flex h-16 items-center justify-between gap-3 md:h-20">
        <div className="flex items-center gap-2 md:gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-full px-2 py-1 hover:bg-primary-50"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-primary-500 text-white shadow-soft">
              <Leaf className="h-5 w-5" />
            </span>
            <div className="hidden flex-col md:flex">
              <span className="text-sm font-semibold tracking-tight text-slate-900">
                {APP_NAME}
              </span>
              <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-primary-500">
                Premium Groceries
              </span>
            </div>
          </Link>
        </div>

        {showSearch && (
          <div className="hidden flex-1 items-center md:flex">
            <div className="relative w-full max-w-xl">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search for fruits, veggies, dairy, snacks..."
                className="h-11 rounded-3xl border-primary-100 bg-slate-50/70 pl-9 pr-4 shadow-none"
              />
            </div>
          </div>
        )}

        <nav className="hidden items-center gap-3 md:flex">
          <NavLink
            to="/products"
            className={({ isActive }) =>
              cn(
                "hidden text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 hover:text-primary-600 lg:inline-flex",
                isActive && "text-primary-600"
              )
            }
          >
            Shop
          </NavLink>
          <NavLink
            to="/orders"
            className={({ isActive }) =>
              cn(
                "hidden text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 hover:text-primary-600 lg:inline-flex",
                isActive && "text-primary-600"
              )
            }
          >
            Orders
          </NavLink>
          {user?.role === "ADMIN" && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                cn(
                  "hidden text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 hover:text-primary-600 lg:inline-flex",
                  isActive && "text-primary-600"
                )
              }
            >
              Admin
            </NavLink>
          )}

          <button
            onClick={toggleCart}
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-50 text-slate-700 shadow-sm transition hover:bg-primary-50 hover:text-primary-700"
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary-500 px-1 text-[10px] font-semibold text-white shadow-soft">
                {itemCount}
              </span>
            )}
          </button>

          <Link to={isAuthenticated ? "/profile" : "/login"}>
            <Button variant="outline" size="md" className="gap-2">
              <User className="h-4 w-4" />
              <span className="hidden text-xs font-semibold uppercase tracking-[0.18em] md:inline">
                {isAuthenticated ? user?.name?.split(" ")[0] ?? "Account" : "Sign In"}
              </span>
            </Button>
          </Link>
        </nav>

        <div className="flex items-center gap-1 md:hidden">
          {showSearch && (
            <Link
              to="/products"
              className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-100 text-slate-600"
            >
              <Search className="h-4 w-4" />
            </Link>
          )}
          <button
            onClick={toggleCart}
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-100 text-slate-700"
          >
            <ShoppingCart className="h-4 w-4" />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-primary-500 px-0.5 text-[9px] font-semibold text-white">
                {itemCount}
              </span>
            )}
          </button>
          <Link
            to={isAuthenticated ? "/profile" : "/login"}
            className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-primary-500 text-white shadow-soft"
          >
            <Package2 className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;

