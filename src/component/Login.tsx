import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hook";
import { RootState } from "../store";
import { useLoginMutation } from "../store/authSlice";
import { useToast } from "../hooks/use-toast";

// Type for login form inputs
interface ILogin {
  email: string;
  password: string;
}

// Validation schema using Yup
const schema = yup.object().shape({
  email: yup.string().email("Incorrect email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Incorrect password")
    .required("Password is required"),
});

const Login = () => {
  // Toast hook for showing notifications
  const { toast } = useToast();

  // Navigation hook
  const nav = useNavigate();

  // Redux dispatch
  const dispatch = useAppDispatch();

  // Get authentication state from Redux
  // const { loading, access, error } = useAppSelector(
  //   (state: RootState) => state.auth
  // );
const [login, { isLoading, error }] = useLoginMutation();
  // State for toggling password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Setup react-hook-form with Yup validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ILogin>({
    resolver: yupResolver(schema),
  });

  // Handle form submission
  const onSubmit = async (data: ILogin) => {
    try {
      // Dispatch login action
      await login(data)

      // Show success toast
      toast({
        title: "Login successful 🎉",
        description: "Welcome back!",
      });

      // Navigate to homepage
      nav("/");
    } catch (err: any) {
      // Show error toast if login fails
      toast({
        title: "Login failed",
        description: err || "Invalid email or password",
      });
    }
  };

  return (
    <div
      className="
        bg-[right_bottom]
        bg-contain
        bg-[url('/images/bg-hero.jpg')]
        h-[100vh] flex justify-center items-center
      "
    >
      <div className="container mx-auto bg-[#f1f2f6] w-[95%] xl:w-[500px] h-[500px] rounded-[50px] px-12 flex flex-col items-center justify-center">
        {/* Title */}
        <h1 className="text-[25px] font-extrabold pb-4">Log in</h1>
        <div className="h-[1px] w-full bg-[#a7a7a733]" />

        {/* Login Form */}
        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
          {/* Email Input */}
          <div className="pt-10 flex flex-col w-full">
            <label className="flex items-center gap-1">
              Email address <span className="text-red-700">*</span>
            </label>
            <input
              className="mt-4 h-10 rounded-full shadow-[#01e281] shadow-sm outline-none py-2 px-6"
              type="email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div className="pt-10 flex flex-col w-full">
            <label className="flex items-center gap-1">
              Password <span className="text-red-700">*</span>
            </label>
            <div className="relative">
              <input
                className="w-full mt-4 h-10 rounded-full shadow-[#01e281] shadow-sm outline-none py-2 px-6"
                type={showPassword ? "text" : "password"}
                {...register("password")}
              />
              {/* Toggle Password Visibility Button */}
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute top-[47%] right-7 flex items-center text-gray-500 hover:text-gray-800"
              >
                {!showPassword ? (
                  <FaRegEyeSlash size={20} />
                ) : (
                  <FaRegEye size={20} />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#01e281] h-12 rounded-full text-white py-3 text-[18px] hover:bg-[#00c46a] transition mt-12"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </form>

        {/* Signup Redirect */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <a
            href="/signup"
            className="text-[#01e281] font-medium hover:underline"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
