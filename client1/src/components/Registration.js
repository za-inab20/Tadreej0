import { Container, Row, Col, FormGroup, Button } from 'reactstrap';
import logo from '../assets/logo.png';
import { UserRegisterSchemaValidation } from '../validations/UserRegisterSchemaValidation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { addUser } from '../features/UserSlice';

const Registration = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { message, isLoading } = useSelector((state) => state.users);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(UserRegisterSchemaValidation),
    defaultValues: {
      accountType: 'user',
    },
  });

  const onSubmit = async (data) => {
    try {
      await dispatch(
        addUser({
          uname: data.uname,
          email: data.email,
          password: data.password,
          accountType: data.accountType,
        })
      ).unwrap();

      setTimeout(() => navigate('/login'), 1200);
    } catch (error) {
      // error message shown from redux state
    }
  };

  return (
    <Container fluid>
      <Row className="div-row">
        <Col md="6" className="div-col">
          <form className="div-form" onSubmit={handleSubmit(onSubmit)}>
            <div style={{ textAlign: 'center' }}>
              <img src={logo} alt="logo" />
              <h2>Register</h2>
              <p>Enter details for registration</p>
            </div>

            <FormGroup>
              <input type="text" className="form-control" placeholder="Enter your name ..." {...register('uname')} />
              <p style={{ color: 'red' }}>{errors.uname?.message}</p>
            </FormGroup>

            <FormGroup>
              <input type="email" className="form-control" placeholder="Enter your email ..." {...register('email')} />
              <p style={{ color: 'red' }}>{errors.email?.message}</p>
            </FormGroup>

            <FormGroup>
              <input type="password" className="form-control" placeholder="Enter your password ..." {...register('password')} />
              <p style={{ color: 'red' }}>{errors.password?.message}</p>
            </FormGroup>

            <FormGroup>
              <input type="password" className="form-control" placeholder="Confirm password..." {...register('confirmPassword')} />
              <p style={{ color: 'red' }}>{errors.confirmPassword?.message}</p>
            </FormGroup>

            <FormGroup>
              <select className="form-control" {...register('accountType')}>
                <option value="user">User</option>
                <option value="freelancer">Freelancer</option>
              </select>
              <p style={{ color: 'red' }}>{errors.accountType?.message}</p>
            </FormGroup>

            <FormGroup>
              <Button className="form-control" type="submit" disabled={isLoading}>
                {isLoading ? 'Registering...' : 'Register'}
              </Button>
            </FormGroup>

            <FormGroup>
              <p>{message}</p>
            </FormGroup>

            <FormGroup style={{ textAlign: 'center' }}>
              <Link to="/login">Go to Login</Link>
            </FormGroup>
          </form>
        </Col>

        <Col md="6" className="div-col2" />
      </Row>
    </Container>
  );
};

export default Registration;
