import { Link } from "react-router-dom";
import PageTransition from "@components/layout/PageTransition";
import Button from "@components/ui/button";

const NotFound = () => {
  return (
    <PageTransition>
      <section className="section">
        <div className="container-wide flex flex-col items-center justify-center gap-4 py-16 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600">
            404 • Page not found
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            This aisle is still being stocked.
          </h1>
          <p className="max-w-md text-sm text-slate-500">
            The page you&apos;re looking for doesn&apos;t exist yet. Explore
            our curated grocery experiences instead.
          </p>
          <Link to="/">
            <Button size="lg">Back to home</Button>
          </Link>
        </div>
      </section>
    </PageTransition>
  );
};

export default NotFound;

