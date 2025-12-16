import { Container, Row, Col, FormGroup, Button } from 'reactstrap';
import logo from '../assets/logo.png'
import { UserSchemaValidaton } from '../validations/UserSchemaValidation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from "react";
import utas from "../assets/utas.png";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { addUser } from '../features/UserSlice';

const Registration = () => {

    let [name, setName] = useState("");
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let [confirmPassword, setConfirnPassword] = useState("");
    let [profilepic, setPic] = useState("");
    let [role, setRole] = useState("admin");

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const message = useSelector((state) => state.users.message);

    const {
        register,
        handleSubmit: submitForm,
        formState: { errors }
    } = useForm({ resolver: yupResolver(UserSchemaValidaton) });

    const handleSubmit = () => {
        const data = {
            uname: name,
            email: email,
            password: password,
            profilepic: profilepic,
            role: role
        }
        dispatch(addUser(data));
    }

    return (
        <Container fluid>
            <Row className='div-row'>

                <Col md='6' className='div-col'>
                    <form className='div-form' onSubmit={submitForm(handleSubmit)}>

                        <div style={{ textAlign: 'center' }}>
                            <img src={logo} alt="logo" />
                            <h2>Register</h2>
                            <p>Enter details for registration</p>
                        </div>

                        {/* Name */}
                        <FormGroup>
                            <input
                                type="text"
                                className='form-control'
                                placeholder='Enter your name ...'
                                {...register("name", { value: name, onChange: (e) => setName(e.target.value) })}
                            />
                            <p style={{ color: 'red' }}>{errors.name?.message}</p>
                        </FormGroup>

                        {/* Email */}
                        <FormGroup>
                            <input
                                type="email"
                                className='form-control'
                                placeholder='Enter your email ...'
                                {...register("email", { value: email, onChange: (e) => setEmail(e.target.value) })}
                            />
                            <p style={{ color: 'red' }}>{errors.email?.message}</p>
                        </FormGroup>

                        {/* Password */}
                        <FormGroup>
                            <input
                                type="password"
                                className='form-control'
                                placeholder='Enter your password ...'
                                {...register("password", { value: password, onChange: (e) => setPassword(e.target.value) })}
                            />
                            <p style={{ color: 'red' }}>{errors.password?.message}</p>
                        </FormGroup>

                        {/* Confirm Password */}
                        <FormGroup>
                            <input
                                type="password"
                                className='form-control'
                                placeholder='Confirm password...'
                                {...register("confirmPassword", { value: confirmPassword, onChange: (e) => setConfirnPassword(e.target.value) })}
                            />
                            <p style={{ color: 'red' }}>{errors.confirmPassword?.message}</p>
                        </FormGroup>

                        {/* Role Dropdown (admin) */}
                        <FormGroup>
                            <select
                                className='form-control'
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <option>admin</option>
                                <option>User</option>
                                <option>Freelancer</option>
                            </select>
                        </FormGroup>

                        {/* Profile Picture */}
                        <FormGroup>
                            <input
                                type="text"
                                className='form-control'
                                placeholder='Profile Picture URL'
                                onChange={(e) => setPic(e.target.value)}
                            />
                        </FormGroup>

                        {/* Register Button */}
                        <FormGroup>
                            <Button className='form-control' type="submit">
                                Register
                            </Button>
                        </FormGroup>

                        <FormGroup>
                            <p>{message}</p>
                        </FormGroup>

                        <FormGroup style={{ textAlign: "center" }}>
                            <Link to="/">Go to Login</Link>
                        </FormGroup>

                    </form>
                </Col>

                {/* Right Image */}
                <Col md="6" className="div-col2">
                    <img src={utas} width="600" height="430" alt="design" />
                </Col>

            </Row>
        </Container>
    );
}

export default Registration;
