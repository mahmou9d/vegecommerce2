import { useEffect } from "react";
import { CheckCircle } from "lucide-react";

const PaymentSuccess = () => {

useEffect(() => {
  const clearCart = async () => {
    try {
      if (window.location.pathname === "/payment-success"){
                await clearCart()
      }
    } catch (err) {
      console.log("GET CART ERROR:", err);
    }
  };

  clearCart();
}, []);


  const goHome = () => {
    window.location.href = "/";
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-200 to-white p-6">
      <div className="flex flex-col items-center bg-white shadow-xl rounded-3xl p-10 animate-fadeIn">
        <CheckCircle className="w-24 h-24 text-green-500 mb-6 animate-bounce" />
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-8 text-center max-w-md">
          Thank you for your payment. Your transaction has been completed
          successfully. You will receive a confirmation email shortly.
        </p>
        <button
          onClick={goHome}
          className="px-8 py-3 bg-green-500 text-white font-semibold rounded-xl shadow-md hover:bg-green-600 transition-all duration-300"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
