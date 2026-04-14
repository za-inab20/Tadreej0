import { FormGroup, Button } from 'reactstrap';
import Logo from '../assets/logo.png';
import { UserSchemaValidaton } from '../validations/UserSchemaValidation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUser } from '../features/UserSlice';
import { useDispatch, useSelector } from 'react-redux';
import { MdOutlineEmail, MdOutlineLock } from 'react-icons/md';
import { IoArrowBack } from 'react-icons/io5';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const dispatch = useDispatch();
  const { user, isSuccess, isError, isLoading, message } = useSelector((state) => state.users);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit: submitForm,
    formState: { errors },
  } = useForm({ resolver: yupResolver(UserSchemaValidaton) });

  const validate = async () => {
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const response = await dispatch(getUser({ email, password })).unwrap();
      setSuccessMsg('Login successful!');

      setTimeout(() => {
        navigate(response.user?.role === 'admin' ? '/admin' : '/project-intro');
      }, 900);
    } catch (error) {
      setErrorMsg(error || 'Invalid email or password');
    }
  };

  useEffect(() => {
    if (isError && message) {
      setErrorMsg(message);
    }
  }, [isError, message]);

  useEffect(() => {
    if (user?.email && isSuccess) {
      setErrorMsg('');
    }
  }, [user, isSuccess]);

  return (
    <div className="login-wrapper">
      <form className="login-box shadow" onSubmit={submitForm(validate)}>
        <button type="button" className="back-btn" onClick={() => navigate('/')}>
          <IoArrowBack /> Back
        </button>

        <img src={Logo} alt="logo" className="login-logo" />

        <h2 className="login-title">Login</h2>
        <h1 className="login-sub">Start Your Journey</h1>

        {successMsg && <p style={{ color: 'green', textAlign: 'center', fontWeight: 'bold' }}>{successMsg}</p>}
        {errorMsg && <p style={{ color: 'red', textAlign: 'center', fontWeight: 'bold' }}>{errorMsg}</p>}

        <FormGroup className="input-group-custom">
          <span className="icon">
            <MdOutlineEmail />
          </span>
          <input
            {...register('email', {
              value: email,
              onChange: (e) => setEmail(e.target.value),
            })}
            placeholder="Enter your email ..."
            type="email"
            className="input-field"
          />
        </FormGroup>

        <p className="error">{errors.email?.message}</p>

        <FormGroup className="input-group-custom">
          <span className="icon">
            <MdOutlineLock />
          </span>
          <input
            {...register('password', {
              value: password,
              onChange: (e) => setPassword(e.target.value),
            })}
            placeholder="Enter your password ..."
            type={showPassword ? 'text' : 'password'}
            className="input-field"
          />
          <span className="icon password-toggle" onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer' }}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </FormGroup>

        <p className="error">{errors.password?.message}</p>

        <Button type="submit" className="login-btn" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>

        <p className="forgot-pwd">
          Forgot password? <Link to="/forgotPassword">Reset password</Link>
        </p>

        <p className="forgot-pwd">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
