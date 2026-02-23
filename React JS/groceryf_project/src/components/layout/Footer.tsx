import { APP_NAME } from "@utils/constants";

const Footer = () => {
  return (
    <footer className="border-t border-slate-100 bg-white/80">
      <div className="container-wide flex flex-col gap-4 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {APP_NAME}. Crafted for lightning-fast,
          beautiful grocery experiences.
        </p>
        <div className="flex flex-wrap gap-3">
          <span>Instant delivery</span>
          <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
          <span>Freshness guaranteed</span>
          <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
          <span>Secure payments</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

