import React, { useState, useEffect } from "react";
import "./ForgotPassword.css";
import { IoArrowBack } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../features/UserSlice";
import Logo from "../assets/logo.png";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const email = location.state?.email || "";
  const otp = location.state?.otp || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { passwordResetStatus, passwordResetMessage } = useSelector((state) => state.users);

  useEffect(() => {
    if (!email || !otp) {
      alert("Missing email or code. Please restart the reset process.");
      navigate("/forgotPassword");
    }
  }, [email, otp, navigate]);

  useEffect(() => {
    if (passwordResetStatus === "failed" && passwordResetMessage) {
      alert(passwordResetMessage);
    }
  }, [passwordResetStatus, passwordResetMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      await dispatch(resetPassword({ email, otp, newPassword })).unwrap();
      alert("Password updated. Please log in.");
      navigate("/login");
    } catch (err) {
      // handled via alert
    }
  };

  return (
    <div className="forgot-wrapper">
      <form className="forgot-card" onSubmit={handleSubmit}>
        <button type="button" className="back-btn" onClick={() => navigate("/verify-otp", { state: { email } })}>
          <IoArrowBack /> Back
        </button>

        <img src={Logo} alt="logo" className="logo-img" />

        <h1 className="title">Set New Password</h1>
        <h1 className="subtitle">Enter and confirm your new password</h1>

        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="input-box"
          style={{ marginBottom: "16px", width: "100%", padding: "12px 14px", borderRadius: "12px", border: "1px solid #e5e7eb" }}
        />

        <input
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="input-box"
          style={{ marginBottom: "20px", width: "100%", padding: "12px 14px", borderRadius: "12px", border: "1px solid #e5e7eb" }}
        />

        <button type="submit" className="send-btn" disabled={passwordResetStatus === "loading"}>
          {passwordResetStatus === "loading" ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
