import PageTransition from "@components/layout/PageTransition";
import Button from "@components/ui/button";
import { useAuth } from "@hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, clearAuth } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate("/");
  };

  return (
    <PageTransition>
      <section className="section">
        <div className="container-wide flex justify-center">
          <div className="glass-panel w-full max-w-lg p-6 sm:p-7">
            <h1 className="section-title text-xl">Profile</h1>
            <div className="mt-4 space-y-3 text-sm text-slate-700">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Name
                </p>
                <p className="mt-1">{user?.name}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Email
                </p>
                <p className="mt-1">{user?.email}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Role
                </p>
                <p className="mt-1">{user?.role}</p>
              </div>
            </div>

            <Button
              variant="outline"
              size="md"
              className="mt-6 w-full sm:w-auto"
              onClick={handleLogout}
            >
              Log out
            </Button>
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default Profile;

