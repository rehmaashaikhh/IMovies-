import React, { useState } from "react";
import confetti from "canvas-confetti";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { 
  X, 
  ShieldCheck, 
  Lock, 
  Loader2,
  Zap,
  CreditCard,
  Smartphone,
  ArrowRight
} from "lucide-react";
import { toast } from "react-toastify";

const PaymentModal = ({ show, movie, selectedSeats, totalSeatPrice, onPaymentSuccess, onClose }) => {
  const { user } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("UPI / QR");

  const convenienceFee = Math.round(totalSeatPrice * 0.05);
  const taxes = Math.round(totalSeatPrice * 0.025);
  const grandTotal = totalSeatPrice + convenienceFee + taxes;

  /**
   * Direct Payment Flow (Bypasses Razorpay Gateway as requested)
   * Calls POST /api/payment/confirm-direct
   */
  const handlePayment = async () => {
    setProcessing(true);

    try {
      const res = await api.post("/payment/confirm-direct", {
        showId: show.showId,
        selectedSeats,
        amount: grandTotal,
        paymentMethod: selectedMethod,
      });

      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to confirm payment.");
      }

      setProcessing(false);

      // Celebration confetti
      confetti({
        particleCount: 140,
        spread: 90,
        origin: { y: 0.6 },
        colors: ["#5B3113", "#B08F7A", "#ffffff"],
      });

      toast.success("Payment confirmed! Your ticket has been issued.");
      onPaymentSuccess({
        booking: res.data.booking,
        paymentMethod: selectedMethod,
        paymentId: res.data.booking.transactionId,
      });
    } catch (err) {
      setProcessing(false);
      console.error("[Payment Error]:", err);
      toast.error(err.response?.data?.message || err.message || "Payment confirmation failed.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#121216] border border-[#5B3113]/40 rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Header with #5B3113 & #B08F7A */}
        <div className="flex items-center justify-between p-5 border-b border-[#27272a] bg-[#09090b]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#5B3113]/25 text-[#B08F7A] flex items-center justify-center border border-[#B08F7A]/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">Cinema Ticket Checkout</h3>
              </div>
              <p className="text-xs text-[#a1a1aa]">Direct Instant Reservation (Zero Gateway Delays)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={processing}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Order Summary Card */}
          <div className="p-5 rounded-xl bg-[#18181f] border border-[#27272a] space-y-3">
            <div className="flex justify-between items-start pb-2 border-b border-[#23324a]">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#B08F7A]">Show Details</span>
                <h4 className="text-base font-bold text-white truncate max-w-[280px]">
                  {movie?.movieName || "Movie"}
                </h4>
                <p className="text-xs text-slate-300">
                  {show.theatreName} • {show.showDate} at {show.showTime}
                </p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#5B3113]/40 text-[#B08F7A] border border-[#B08F7A]/30">
                Live Reserved
              </span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-[#a1a1aa]">Selected Seats ({selectedSeats.length}):</span>
              <span className="font-mono font-bold text-[#B08F7A]">{selectedSeats.join(", ")}</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-[#a1a1aa]">Tickets Base Price:</span>
              <span className="text-slate-200">₹{totalSeatPrice}</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-[#a1a1aa]">Convenience Fee (5%):</span>
              <span className="text-slate-200">₹{convenienceFee}</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-[#a1a1aa]">Integrated Taxes (2.5%):</span>
              <span className="text-slate-200">₹{taxes}</span>
            </div>

            <div className="pt-3 border-t border-[#27272a] flex justify-between items-center">
              <span className="font-bold text-white text-sm">Total Payable:</span>
              <span className="text-2xl font-black text-[#B08F7A]">₹{grandTotal}</span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider mb-2.5">
              Select Payment Method
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: "UPI / QR", label: "UPI & QR", sub: "GPay, PhonePe, Paytm", icon: Smartphone },
                { id: "Cards", label: "Cards", sub: "Visa, Mastercard, RuPay", icon: CreditCard },
                { id: "Net Banking", label: "Net Banking", sub: "All Major Banks", icon: ShieldCheck },
                { id: "Wallets", label: "Wallets", sub: "Paytm, Mobikwik & more", icon: Zap },
              ].map((item) => {
                const IconComponent = item.icon;
                const isSelected = selectedMethod === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedMethod(item.id)}
                    className={`p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer flex items-center gap-3 active:scale-95 ${
                      isSelected
                        ? "bg-[#5B3113]/30 border-[#B08F7A] text-white shadow-md shadow-[#5B3113]/40"
                        : "bg-[#18181f] border-[#27272a] text-[#a1a1aa] hover:border-[#B08F7A]/50 hover:text-white"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isSelected ? "bg-[#B08F7A] text-slate-950" : "bg-[#121216] text-[#B08F7A]"
                    }`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{item.label}</p>
                      <p className="text-[10px] text-[#a1a1aa] truncate">{item.sub}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Button styled with #5B3113 & #B08F7A */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handlePayment}
              disabled={processing}
              className={`w-full py-4 px-6 rounded-2xl font-bold text-white transition-all duration-200 shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group text-base cursor-pointer active:scale-95 ${
                processing
                  ? "bg-[#5B3113]/70 cursor-wait"
                  : "bg-gradient-to-r from-[#5B3113] via-[#733e18] to-[#5B3113] hover:from-[#733e18] hover:to-[#5B3113] border border-[#B08F7A]/40 shadow-[#5B3113]/50"
              }`}
            >
              {processing ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Confirming Booking & Dispatching Email...</span>
                </div>
              ) : (
                <div className="flex items-center justify-between w-full px-2">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#B08F7A]" />
                    <span>Confirm &amp; Pay ₹{grandTotal}</span>
                  </div>
                  <span className="flex items-center gap-1 font-semibold text-xs bg-black/40 text-[#B08F7A] px-2.5 py-1 rounded-lg border border-[#B08F7A]/30">
                    <span>{selectedMethod}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-[#a1a1aa]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#B08F7A]" />
              <span>Brevo automated email ticket confirmation enabled</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default PaymentModal;
