import PageTransition from "@components/layout/PageTransition";
import CartItemRow from "@components/cart/CartItem";
import CartSummary from "@components/cart/CartSummary";
import Button from "@components/ui/button";
import { useCart } from "@hooks/useCart";
import { ShoppingBag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const { items, total, itemCount, clearCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (itemCount === 0) {
    return (
      <PageTransition>
        <section className="section">
          <div className="container-wide flex flex-col items-center justify-center gap-4 py-10 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-50 text-primary-500">
              <ShoppingBag className="h-10 w-10" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">
                Your cart is empty
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Discover beautifully shot, premium groceries and fill your cart in
                a few taps.
              </p>
            </div>
            <Link to="/products">
              <Button size="lg">Start shopping</Button>
            </Link>
          </div>
        </section>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <section className="section">
        <div className="container-wide grid gap-6 lg:grid-cols-[minmax(0,1.4fr),minmax(0,0.9fr)]">
          <div className="space-y-3">
            <h1 className="section-title text-xl">Your cart</h1>
            <div className="space-y-3">
              {items.map((item) => (
                <CartItemRow key={item.id} item={item} />
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Order summary
            </h2>
            <CartSummary total={total} itemCount={itemCount} />
            <Button size="lg" className="w-full" onClick={handleCheckout}>
              Proceed to checkout
            </Button>
            <Button
              size="md"
              variant="ghost"
              className="w-full text-xs font-semibold uppercase tracking-[0.18em] text-slate-500"
              onClick={clearCart}
            >
              Clear cart
            </Button>
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default Cart;

