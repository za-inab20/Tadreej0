import React, { useState, useEffect } from "react";
import "./ForgotPassword.css";
import { MdEmail } from "react-icons/md";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { requestPasswordReset } from "../features/UserSlice";
import Logo from "../assets/logo.png";


const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { resetStatus, resetMessage } = useSelector((state) => state.users);

    useEffect(() => {
        if (resetStatus === "failed" && resetMessage) {
            alert(resetMessage);
        }
    }, [resetStatus, resetMessage]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            alert("Please enter your email");
            return;
        }

        try {
            await dispatch(requestPasswordReset(email)).unwrap();
            alert("Reset code sent to your email.");
            navigate("/verify-otp", { state: { email } });
        } catch (err) {
            // error surfaced via alert in useEffect
        }
    };

    return (
        <div className="forgot-wrapper">
            <form className="forgot-card" onSubmit={handleSubmit}>
                <button 
                    type="button"
                    className="back-btn" 
                    onClick={() => navigate("/login")}
                >
                    <IoArrowBack /> Back
                </button>

                <img src={Logo} alt="logo" className="logo-img" />

                <h1 className="title">Forgot Password</h1>
                <h1 className="subtitle">Enter your email to get a 6-digit code (valid for 2 minutes)</h1>

                <div className="input-wrapper">
                    <span className="icon"><MdEmail /></span>
                    <input
                        type="email"
                        placeholder="Enter your email ..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-box"
                    />
                </div>

                <button type="submit" className="send-btn" disabled={resetStatus === "loading"}>
                    {resetStatus === "loading" ? "Sending..." : "Send Reset Code"}
                </button>
            </form>
        </div>
    );
}
export default ForgotPassword;
