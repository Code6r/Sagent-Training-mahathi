import Drawer from "@components/ui/drawer";
import Button from "@components/ui/button";
import { useCart } from "@hooks/useCart";
import CartItemRow from "@components/cart/CartItem";
import CartSummary from "@components/cart/CartSummary";
import { ShoppingBag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const CartDrawer = () => {
  const { isOpen, closeCart, items, total, itemCount } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    closeCart();
    navigate("/checkout");
  };

  return (
    <Drawer open={isOpen} onClose={closeCart} title="Your Cart">
      {itemCount === 0 ? (
        <div className="flex h-full flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-primary-50 text-primary-500">
            <ShoppingBag className="h-9 w-9" />
          </div>
          <h3 className="text-base font-semibold text-slate-900">
            Your cart is feeling light
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Discover premium groceries handpicked for freshness and speed.
          </p>
          <Link to="/products" onClick={closeCart} className="mt-4">
            <Button size="md">Browse products</Button>
          </Link>
        </div>
      ) : (
        <div className="flex h-full flex-col gap-4">
          <div className="flex-1 space-y-3 overflow-y-auto pb-3">
            {items.map((item) => (
              <CartItemRow key={item.id} item={item} />
            ))}
          </div>
          <CartSummary total={total} itemCount={itemCount} />
          <Button
            size="lg"
            className="mb-2 w-full"
            onClick={handleCheckout}
          >
            Checkout securely
          </Button>
        </div>
      )}
    </Drawer>
  );
};

export default CartDrawer;

