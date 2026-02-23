import PageTransition from "@components/layout/PageTransition";
import Button from "@components/ui/button";
import { Link } from "react-router-dom";
import { HERO_IMAGE_URL } from "@utils/constants";
import { formatCurrency } from "@utils/currency";
import { ShoppingBag, Timer, ShieldCheck, Truck, ArrowRight } from "lucide-react";

const Home = () => {
  return (
    <PageTransition>
      <section className="section">
        <div className="container-wide grid gap-8 lg:grid-cols-[1.05fr,0.95fr] lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-700">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
              Under 15 minutes delivery across the city
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Fresh groceries,
              <span className="bg-gradient-to-r from-primary-500 to-emerald-600 bg-clip-text text-transparent">
                {" "}
                delivered like a luxury service.
              </span>
            </h1>
            <p className="max-w-xl text-sm text-slate-600 sm:text-base">
              Handpicked fruits, vegetables, dairy, and essentials. Built with a
              FAANG-level focus on smoothness, speed, and delight.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link to="/products">
                <Button size="lg" className="gap-2">
                  Start shopping
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link
                to="/products"
                className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 hover:text-primary-600"
              >
                Explore categories
              </Link>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-xs text-slate-600 sm:max-w-md">
              <div className="rounded-2xl bg-white/90 p-3 shadow-soft">
                <div className="mb-1 flex items-center gap-2 text-slate-900">
                  <Timer className="h-4 w-4 text-primary-500" />
                  <span className="font-semibold">15 min avg</span>
                </div>
                <p>Optimized routing and smart batching for true instant deliveries.</p>
              </div>
              <div className="rounded-2xl bg-white/90 p-3 shadow-soft">
                <div className="mb-1 flex items-center gap-2 text-slate-900">
                  <ShieldCheck className="h-4 w-4 text-primary-500" />
                  <span className="font-semibold">Freshness lock</span>
                </div>
                <p>Cold-chain aware picking with multi-point quality checks.</p>
              </div>
              <div className="rounded-2xl bg-white/90 p-3 shadow-soft">
                <div className="mb-1 flex items-center gap-2 text-slate-900">
                  <Truck className="h-4 w-4 text-primary-500" />
                  <span className="font-semibold">Free delivery</span>
                </div>
                <p>Zero delivery fee above {formatCurrency(499)} cart value.</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="glass-panel overflow-hidden">
              <img
                src={HERO_IMAGE_URL}
                alt="Fresh groceries"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 left-4 right-4">
              <div className="glass-panel flex items-center justify-between px-4 py-3 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary-500 text-white shadow-soft">
                    <ShoppingBag className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">
                      10,000+ premium orders
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Loved by modern households and busy professionals.
                    </p>
                  </div>
                </div>
                <div className="hidden flex-col items-end text-[11px] text-slate-500 sm:flex">
                  <span>Rated 4.9/5</span>
                  <span>Across all major metros</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section pt-10">
        <div className="container-wide space-y-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="section-title">Curated for everyday luxury</h2>
              <p className="section-subtitle">
                Handpicked categories with ultra-high quality photos and premium
                selections.
              </p>
            </div>
            <Link
              to="/products"
              className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600"
            >
              View all products
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Seasonal fruits",
                desc: "Farm-to-home in hours, not days.",
                image:
                  "https://images.pexels.com/photos/65174/pexels-photo-65174.jpeg?auto=compress&cs=tinysrgb&w=1200"
              },
              {
                title: "Chef-grade veggies",
                desc: "Crisp, colourful, and recipe ready.",
                image:
                  "https://images.pexels.com/photos/3952047/pexels-photo-3952047.jpeg?auto=compress&cs=tinysrgb&w=1200"
              },
              {
                title: "Artisan dairy",
                desc: "Cold-chain protected, preservative-light.",
                image:
                  "https://images.pexels.com/photos/5946967/pexels-photo-5946967.jpeg?auto=compress&cs=tinysrgb&w=1200"
              },
              {
                title: "Gourmet pantry",
                desc: "Imported staples, oils, and snacks.",
                image:
                  "https://images.pexels.com/photos/4110252/pexels-photo-4110252.jpeg?auto=compress&cs=tinysrgb&w=1200"
              }
            ].map((card) => (
              <div
                key={card.title}
                className="group relative overflow-hidden rounded-3xl bg-slate-900/90"
              >
                <img
                  src={card.image}
                  alt={card.title}
                  className="h-52 w-full object-cover opacity-80 transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute inset-x-4 bottom-4 space-y-1.5 text-white">
                  <p className="text-sm font-semibold">{card.title}</p>
                  <p className="text-[11px] text-slate-200">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default Home;

