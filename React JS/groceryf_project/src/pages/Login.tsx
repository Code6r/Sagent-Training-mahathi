import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import PageTransition from "@components/layout/PageTransition";
import Label from "@components/ui/label";
import Input from "@components/ui/input";
import Button from "@components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { loginApi } from "@api/auth.api";
import { useAuth } from "@hooks/useAuth";
import { toast } from "sonner";
import { APP_NAME } from "@utils/constants";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as any;
  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema)
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: loginApi
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const res = await mutateAsync(values);
      setAuth(res);
      toast.success("Welcome back.");
      navigate(from, { replace: true });
    } catch {
      toast.error("Invalid credentials or server error.");
    }
  };

  return (
    <PageTransition>
      <section className="section">
        <div className="container-wide flex justify-center">
          <div className="glass-panel w-full max-w-md p-6 sm:p-7">
            <div className="mb-4 space-y-1">
              <h1 className="text-xl font-semibold tracking-tight text-slate-900">
                Sign in to {APP_NAME}
              </h1>
              <p className="text-xs text-slate-500">
                Experience a FAANG-grade grocery interface built for speed and
                polish.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register("email")} />
                {errors.email && (
                  <p className="mt-1 text-xs text-rose-500">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" {...register("password")} />
                {errors.password && (
                  <p className="mt-1 text-xs text-rose-500">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full"
                loading={isPending}
              >
                Continue
              </Button>
            </form>

            <p className="mt-4 text-center text-xs text-slate-500">
              New here?{" "}
              <Link
                to="/register"
                className="font-semibold text-primary-600 hover:text-primary-700"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default Login;

