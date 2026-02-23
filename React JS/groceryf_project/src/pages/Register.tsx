import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import PageTransition from "@components/layout/PageTransition";
import Label from "@components/ui/label";
import Input from "@components/ui/input";
import Button from "@components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { registerApi } from "@api/auth.api";
import { useAuth } from "@hooks/useAuth";
import { toast } from "sonner";
import { APP_NAME } from "@utils/constants";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6)
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match"
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema)
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: registerApi
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      const res = await mutateAsync({
        name: values.name,
        email: values.email,
        password: values.password
      });
      setAuth(res);
      toast.success("Account created successfully.");
      navigate("/");
    } catch {
      toast.error("Could not create your account. Please try again.");
    }
  };

  return (
    <PageTransition>
      <section className="section">
        <div className="container-wide flex justify-center">
          <div className="glass-panel w-full max-w-md p-6 sm:p-7">
            <div className="mb-4 space-y-1">
              <h1 className="text-xl font-semibold tracking-tight text-slate-900">
                Join {APP_NAME}
              </h1>
              <p className="text-xs text-slate-500">
                Create a premium grocery account in seconds.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <Label htmlFor="name">Full name</Label>
                <Input id="name" {...register("name")} />
                {errors.name && (
                  <p className="mt-1 text-xs text-rose-500">
                    {errors.name.message}
                  </p>
                )}
              </div>
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
              <div>
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-rose-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full"
                loading={isPending}
              >
                Create account
              </Button>
            </form>

            <p className="mt-4 text-center text-xs text-slate-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-primary-600 hover:text-primary-700"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default Register;

