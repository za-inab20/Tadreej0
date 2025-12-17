import {
    Container,
    Row,
    Col,
    FormGroup,
    Button,
} from "reactstrap";
import Logo from "../assets/logo.png";
import { UserRegisterSchemaValidation } from "../validations/UserRegisterSchemaValidation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { addUser } from "../features/UserSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { IoArrowBack } from "react-icons/io5";
import { useState } from "react";
import { configureStore } from "@reduxjs/toolkit";


const Register = () => {
    const dispatch = useDispatch();
    const message = useSelector((state) => state.users.message || "");
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(UserRegisterSchemaValidation),
    });

    const onSubmit = (data) => {
        // Prepare data to match server expectations
        const userData = {
            uname: data.uname,
            email: data.email,
            password: data.password,
            profilepic: data.role // Using role as profilepic placeholder or you can set a default
        };

        dispatch(addUser(userData));

        // Navigate after successful registration
        setTimeout(() => {
            navigate("/login");
        }, 1500);
    };

    return (
        <div className="register-page">
            <Container>
                <Row className="justify-content-center">
                    <Col md="6" lg="5">
                        <form
                            className="register-card text-center"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <button
                                type="button"
                                className="back-btn"
                                onClick={() => navigate("/login")}
                            >
                                <IoArrowBack /> Back
                            </button>

                            <img src={Logo} alt="Logo" className="logo-img" />

                            <h1 className="title">Register</h1>
                            <h1 className="subtitle">Enter details for registration</h1>

                            {/* USERNAME */}
                            <FormGroup className="input-wrapper">
                                <span className="icon">
                                    <FaUser />
                                </span>
                                <input
                                    type="text"
                                    placeholder="Enter your name ..."
                                    className="input-box"
                                    {...register("uname")}
                                />
                            </FormGroup>
                            <p className="error">{errors.uname?.message}</p>

                            {/* EMAIL */}
                            <FormGroup className="input-wrapper">
                                <span className="icon">
                                    <MdEmail />
                                </span>
                                <input
                                    type="email"
                                    placeholder="Enter your email ..."
                                    className="input-box"
                                    {...register("email")}
                                />
                            </FormGroup>
                            <p className="error">{errors.email?.message}</p>

                            {/* PASSWORD */}
                            <FormGroup className="input-wrapper">
                                <span className="icon">
                                    <FaLock />
                                </span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password ..."
                                    className="input-box"
                                    {...register("password")}
                                />
                                <span
                                    className="icon password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </FormGroup>
                            <p className="error">{errors.password?.message}</p>

                            {/* CONFIRM PASSWORD */}
                            <FormGroup className="input-wrapper">
                                <span className="icon">
                                    <FaLock />
                                </span>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm password ..."
                                    className="input-box"
                                    {...register("confirmPassword")}
                                />
                                <span
                                    className="icon password-toggle"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </FormGroup>
                            <p className="error">{errors.confirmPassword?.message}</p>

                            {/* ROLE */}
                            <FormGroup className="input-wrapper">
                                <select className="input-box" {...register("role")}>
                                    <option value="admin">admin</option>
                                    <option value="User">User</option>
                                    <option value="Freelancer">Freelancer</option>
                                </select>
                            </FormGroup>

                            <Button className="register-btn" type="submit">
                                Register
                            </Button>

                            <p className="message">{message}</p>
                        </form>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Register;
