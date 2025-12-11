// import { TiHome } from "react-icons/ti";
// import { IoIosArrowForward } from "react-icons/io";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { Button } from "../components/ui/button";
// import { signupUser } from "../store/authSecSlice";
import { useAppDispatch, useAppSelector } from "../store/hook";
// import { RootState } from "../store";
import { useNavigate } from "react-router-dom";
import { useLoginMutation, useSignupMutation } from "../store/authSlice";
import { useToast } from "../hooks/use-toast";

// -------------------------------
// Signup form interface
// -------------------------------
interface ISignup {
  username: string;
  email: string;
  password1: string;
  password2: string;
}

// -------------------------------
// Validation schema (Yup)
// -------------------------------
const schema = yup.object().shape({
  username: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password1: yup
    .string()
    .min(6, "Password must be at least 6 chars")
    .required("Password is required"),
  password2: yup
    .string()
    .oneOf([yup.ref("password1")], "Passwords must match")
    .required("Confirm your password"),
});

// -------------------------------
// Signup Component
// -------------------------------
const Signup = () => {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useAppDispatch();
  const nav = useNavigate();

  // Access signup state from Redux
  // const { loading, message, error } = useAppSelector(
  //   (state: RootState) => state.authSec
  // );
 const [signup, { isLoading, isSuccess }] = useSignupMutation();
 const [login] = useLoginMutation();
  // React Hook Form setup with Yup validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ISignup>({
    resolver: yupResolver(schema),
  });

  // -------------------------------
  // Submit Handler
  // -------------------------------
  const onSubmit = async (data: ISignup) => {
    try {
      // First: signup
      await signup(data)

      // Second: auto-login after signup
      const loginPayload = {
        email: data.email,
        password: data.password1,
      };
      await login(loginPayload);
localStorage.setItem("username", data.username);
      // Success notification
      toast({
        title: "Signup Successful 🎉",
        description: "Welcome! You have been logged in successfully.",
      });

      nav("/");
    } catch (err: any) {
      // Error notification
      toast({
        title: "Signup Failed ❌",
        description: err?.message || "Something went wrong, please try again.",
      });
    }
  };

  // -------------------------------
  // JSX Layout
  // -------------------------------
  return (
    <div
      className="
        bg-[right_bottom] 
        bg-contain 
        bg-[url('/images/bg-hero.jpg')] 
        h-[100vh] flex justify-center items-center
      "
    >
      <div className="container mx-auto bg-[#f1f2f6] mt-10 w-[95%] xl:w-[500px] min-h-[500px] rounded-[50px] px-12 py-4 flex flex-col items-center justify-center">
        {/* Title */}
        <h1 className="text-[25px] font-extrabold pb-4">Sign up</h1>
        <div className="h-[1px] w-full bg-[#a7a7a733]" />

        {/* Signup Form */}
        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
          {/* Username Field */}
          <div className="pt-10 flex flex-col w-full">
            <label className="flex items-center gap-1">
              Username<span className="text-red-700"> *</span>
            </label>
            <input
              className="mt-4 h-10 rounded-full shadow-[#01e281] shadow-sm outline-none py-2 px-6"
              type="text"
              {...register("username")}
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="pt-10 flex flex-col w-full">
            <label className="flex items-center gap-1">
              Email address<span className="text-red-700"> *</span>
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

          {/* Password Field */}
          <div className="pt-10 flex flex-col w-full">
            <label className="flex items-center gap-1">
              Password<span className="text-red-700"> *</span>
            </label>
            <div className="relative">
              <input
                className="w-full mt-4 h-10 rounded-full shadow-[#01e281] shadow-sm outline-none py-2 px-6"
                type={showPassword ? "text" : "password"}
                {...register("password1")}
              />
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
            {errors.password1 && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password1.message}
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="pt-10 flex flex-col w-full">
            <label className="flex items-center gap-1">
              Confirm password<span className="text-red-700"> *</span>
            </label>
            <div className="relative">
              <input
                className="w-full mt-4 h-10 rounded-full shadow-[#01e281] shadow-sm outline-none py-2 px-6"
                type={showConfirmPassword ? "text" : "password"}
                {...register("password2")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((p) => !p)}
                className="absolute top-[47%] right-7 flex items-center text-gray-500 hover:text-gray-800"
              >
                {!showConfirmPassword ? (
                  <FaRegEyeSlash size={20} />
                ) : (
                  <FaRegEye size={20} />
                )}
              </button>
            </div>
            {errors.password2 && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password2.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#01e281] h-12 rounded-full text-white py-3 text-[18px] hover:bg-[#00c46a] transition mt-12"
          >
            {isSubmitting ? "Signing up..." : "Signup"}
          </Button>
        </form>

        {/* Redirect to Login */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?
          <a
            href="/login"
            className="text-[#01e281] font-medium hover:underline pl-1"
          >
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
