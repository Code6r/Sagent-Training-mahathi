import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import PageTransition from "@components/layout/PageTransition";
import Label from "@components/ui/label";
import Input from "@components/ui/input";
import Button from "@components/ui/button";
import { useCart } from "@hooks/useCart";
import { formatCurrency } from "@utils/currency";
import { useMutation } from "@tanstack/react-query";
import { createOrderApi } from "@api/order.api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { PaymentMethod } from "@utils/types";

const addressSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(8),
  street: z.string().min(4),
  city: z.string().min(2),
  state: z.string().min(2),
  postalCode: z.string().min(4),
  paymentMethod: z.enum(["CARD", "UPI", "COD"])
});

type AddressFormValues = z.infer<typeof addressSchema>;

const Checkout = () => {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      paymentMethod: "CARD"
    }
  });

  const { mutateAsync } = useMutation({
    mutationFn: (values: AddressFormValues) =>
      createOrderApi({
        address: {
          fullName: values.fullName,
          phone: values.phone,
          street: values.street,
          city: values.city,
          state: values.state,
          postalCode: values.postalCode
        },
        paymentMethod: values.paymentMethod as PaymentMethod
      })
  });

  const onSubmit = async (values: AddressFormValues) => {
    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    try {
      // Show payment processing
      toast.loading("Processing payment...", { id: "payment" });
      
      // Simulate payment delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const order = await mutateAsync(values);
      
      toast.success("Payment successful! Order placed.", { id: "payment" });
      toast.success(`Order #${order.id} confirmed. Tracking in real-time!`);
      
      clearCart();
      
      // Navigate to orders with order ID for tracking
      navigate(`/orders?orderId=${order.id}`);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong while placing your order.", { id: "payment" });
    }
  };

  return (
    <PageTransition>
      <section className="section">
        <div className="container-wide grid gap-8 lg:grid-cols-[minmax(0,1.4fr),minmax(0,0.9fr)]">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 rounded-3xl bg-white/80 p-5 shadow-soft"
          >
            <h1 className="section-title text-xl">Checkout</h1>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="fullName">Full name</Label>
                <Input id="fullName" {...register("fullName")} />
                {errors.fullName && (
                  <p className="mt-1 text-xs text-rose-500">
                    {errors.fullName.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" {...register("phone")} />
                {errors.phone && (
                  <p className="mt-1 text-xs text-rose-500">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="street">Street & house</Label>
              <Input id="street" {...register("street")} />
              {errors.street && (
                <p className="mt-1 text-xs text-rose-500">
                  {errors.street.message}
                </p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" {...register("city")} />
                {errors.city && (
                  <p className="mt-1 text-xs text-rose-500">
                    {errors.city.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input id="state" {...register("state")} />
                {errors.state && (
                  <p className="mt-1 text-xs text-rose-500">
                    {errors.state.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="postalCode">Postal code</Label>
                <Input id="postalCode" {...register("postalCode")} />
                {errors.postalCode && (
                  <p className="mt-1 text-xs text-rose-500">
                    {errors.postalCode.message}
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-r from-primary-50 to-emerald-50 p-3 text-xs">
              <p className="font-semibold text-primary-700">💳 Demo Payment Mode</p>
              <p className="mt-1 text-slate-600">
                This is a demo checkout. Payment will be simulated instantly. No real charges will be made.
              </p>
            </div>

            <div>
              <Label>Payment method</Label>
              <div className="mt-2 grid gap-3 sm:grid-cols-3">
                {[
                  { value: "CARD", label: "Card" },
                  { value: "UPI", label: "UPI" },
                  { value: "COD", label: "Cash on delivery" }
                ].map((method) => (
                  <label
                    key={method.value}
                    className="flex cursor-pointer items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700"
                  >
                    <input
                      type="radio"
                      value={method.value}
                      {...register("paymentMethod")}
                      className="h-3.5 w-3.5 accent-primary-500"
                    />
                    <span>{method.label}</span>
                  </label>
                ))}
              </div>
              {errors.paymentMethod && (
                <p className="mt-1 text-xs text-rose-500">
                  {errors.paymentMethod.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full sm:w-auto"
              loading={isSubmitting}
            >
              Place order
            </Button>
          </form>

          <aside className="space-y-4 rounded-3xl bg-white/80 p-5 shadow-soft">
            <h2 className="text-sm font-semibold text-slate-900">
              Order summary
            </h2>
            <div className="space-y-2 text-xs text-slate-600">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-2"
                >
                  <span className="flex-1">
                    {item.quantity} × {item.product.name}
                  </span>
                  <span className="font-semibold text-slate-900">
                    {formatCurrency(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-100 pt-3 text-sm">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Subtotal</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Delivery</span>
                <span className="text-emerald-600">Free</span>
              </div>
              {total > 200 && (
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Discount (Above ₹200)</span>
                  <span className="font-semibold text-emerald-600">-{formatCurrency(25)}</span>
                </div>
              )}
              <div className="mt-2 flex items-center justify-between text-sm font-semibold text-slate-900">
                <span>Total</span>
                <span>{formatCurrency(total > 200 ? total - 25 : total)}</span>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </PageTransition>
  );
};

export default Checkout;

