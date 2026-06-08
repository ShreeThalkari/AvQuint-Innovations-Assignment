import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckSquare, Mail, Lock } from "lucide-react";
import { authService } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { toast } from "../utils/toast";

interface FormValues {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (!values.email.trim()) errors.email = "Email is required";
  else if (!/\S+@\S+\.\S+/.test(values.email)) errors.email = "Invalid email";
  if (!values.password) errors.password = "Password is required";
  return errors;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { saveAuth } = useAuth();

  const [values, setValues] = useState<FormValues>({ email: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  function handleChange(field: keyof FormValues) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validationErrors = validate(values);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const data = await authService.login({
        email: values.email.trim(),
        password: values.password,
      });
      saveAuth(data.token, data.user);
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate("/dashboard");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Invalid email or password.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-11 h-11 rounded-2xl bg-violet-600 flex items-center justify-center mb-3 shadow-lg shadow-violet-900/40">
            <CheckSquare size={22} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-zinc-100">Welcome back</h1>
          <p className="text-sm text-zinc-500 mt-1">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={values.email}
              onChange={handleChange("email")}
              error={errors.email}
              leftIcon={<Mail size={15} />}
              autoComplete="email"
              autoFocus
            />
            <Input
              label="Password"
              type="password"
              placeholder="Your password"
              value={values.password}
              onChange={handleChange("password")}
              error={errors.password}
              leftIcon={<Lock size={15} />}
              autoComplete="current-password"
            />

            <Button type="submit" loading={loading} size="lg" className="mt-1 w-full">
              Sign In
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-zinc-500 mt-5">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
