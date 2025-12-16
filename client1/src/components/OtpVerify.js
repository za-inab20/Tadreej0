import React, { useState, useEffect } from "react";
import "./ForgotPassword.css";
import { IoArrowBack } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { verifyOtp, requestPasswordReset } from "../features/UserSlice";
import Logo from "../assets/logo.png";

const OtpVerify = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const presetEmail = location.state?.email || "";
  const [email, setEmail] = useState(presetEmail);
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const { otpStatus, otpMessage } = useSelector((state) => state.users);

  useEffect(() => {
    if (otpStatus === "failed" && otpMessage) {
      setMessage({ text: otpMessage, type: "error" });
    }
  }, [otpStatus, otpMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });
    if (!email || !otp) {
      setMessage({ text: "Please fill all fields", type: "error" });
      return;
    }
    try {
      await dispatch(verifyOtp({ email, otp })).unwrap();
      // Success handled by navigation, but can show brief success
      navigate("/reset-password", { state: { email, otp } });
    } catch (err) {
      // handled via useEffect or here
    }
  };

  const handleOtpChange = (value) => {
    const sanitized = value.replace(/[^0-9]/g, "").slice(0, 6);
    setOtp(sanitized);
  };

  const handleResend = async () => {
    setMessage({ text: "", type: "" });
    if (!email) {
      setMessage({ text: "Email is missing. Please go back and enter your email.", type: "error" });
      return;
    }
    try {
      await dispatch(requestPasswordReset(email)).unwrap();
      setMessage({ text: "New code sent to your email.", type: "success" });
    } catch (err) {
      setMessage({ text: "Failed to resend code. Please try again.", type: "error" });
    }
  };

  return (
    <div className="forgot-wrapper">
      <form className="forgot-card" onSubmit={handleSubmit}>
        <button type="button" className="back-btn" onClick={() => navigate("/forgotPassword")}> 
          <IoArrowBack /> Back
        </button>

        <img src={Logo} alt="logo" className="logo-img" />

        <h1 className="title">Verify Code</h1>
        <h1 className="subtitle">Enter the 6-digit code sent to your email (expires in 2 minutes)</h1>
{message.text && (
          <div style={{ 
            marginBottom: "16px", 
            padding: "10px", 
            borderRadius: "8px", 
            fontSize: "14px",
            backgroundColor: message.type === "error" ? "#fee2e2" : "#dcfce7",
            color: message.type === "error" ? "#b91c1c" : "#15803d",
            textAlign: "center"
          }}>
            {message.text}
          </div>
        )}

        
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-box"
          style={{ marginBottom: "16px", width: "100%", padding: "12px 14px", borderRadius: "12px", border: "1px solid #e5e7eb" }}
        />

        <input
          type="text"
          placeholder="Enter 6-digit code"
          value={otp}
          onChange={(e) => handleOtpChange(e.target.value)}
          className="input-box"
          style={{ letterSpacing: "6px", textAlign: "center", fontSize: "20px", width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid #e5e7eb", marginBottom: "20px" }}
        />

        <button type="submit" className="send-btn" disabled={otpStatus === "loading"}>
          {otpStatus === "loading" ? "Verifying..." : "Verify Code"}
        </button>
        
        <div style={{ marginTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
          <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>
            Code expired?
          </p>
          <button 
            type="button" 
            onClick={handleResend}
            style={{ background: "none", border: "none", color: "#4f46e5", cursor: "pointer", fontSize: "13px", fontWeight: "600", padding: 0 }}
          >
            Resend Code
          </button>
        </div>
      </form>
    </div>
  );
};

export default OtpVerify;
