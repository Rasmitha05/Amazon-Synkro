import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import customFetch from '../utils/customFetch'; // Adjust path as needed
import styled from 'styled-components';
import { backgroundmg } from '../images'; // Adjust path as needed
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Styled components
const Container = styled.div`
  background-color: transparent;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
  width: 50vw;
  max-width: 100%;
  min-height: 30vw;
  height: 60vh;
`;

const SignUpContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  opacity: 0;
  transition: transform 0.6s ease-in-out, opacity 0.6s ease-in-out;
  ${(props) =>
    props.$signinIn === false
      ? `transform: translateX(0); opacity: 1;`
      : `transform: translateX(100%); opacity: 0;`}
`;

const SignInContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  transition: transform 0.6s ease-in-out, opacity 0.6s ease-in-out;
  ${(props) =>
    props.$signinIn === true
      ? `transform: translateX(0); opacity: 1;`
      : `transform: translateX(-100%); opacity: 0;`}
`;

const Form = styled.form`
  background-color: rgba(255, 237, 213, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 50px;
  height: 100%;
  text-align: center;
`;

const Title = styled.h1`
  font-weight: bold;
  margin: 0;
  margin-bottom: 1vh;
  font-size: x-large;
`;

const Input = styled.input`
  background-color: rgba(255, 237, 213, 1);
  border: 1px solid brown;
  border-radius: 2vh;
  padding: 12px 15px;
  margin: 8px 0;
  width: 100%;
`;

const Button = styled.button`
  border-radius: 20px;
  background-color: rgba(67, 20, 7, 1);
  color: #ffffff;
  font-size: 12px;
  font-weight: bold;
  padding: 12px 45px;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: transform 80ms ease-in;
  &:active {
    transform: scale(0.95);
  }
  &:focus {
    outline: none;
  }
`;

const Anchor = styled.a`
  color: #333;
  font-size: 14px;
  text-decoration: none;
  margin: 15px 0;
  cursor: pointer;
`;

const Login = () => {
  const [signIn, setSignIn] = useState(true); // Toggle between sign-in and sign-up
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password1: '',
  });
  const navigate = useNavigate();

  const toggle = () => {
    setSignIn(!signIn);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!signIn && formData.password !== formData.password1) {
      toast.error('Passwords do not match!');
      return;
    }

    const url = signIn ? '/auth/login' : '/auth/register';
    const data = {
      email: formData.email,
      password: formData.password,
      ...(signIn ? {} : { name: formData.name }),
    };

    const loadingToastId = toast.loading('Processing...');
    try {
      const response = await customFetch.post(url, data);
      toast.update(loadingToastId, {
        render: signIn
          ? 'Logged in successfully!'
          : 'Account created successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 5000,
      });
      navigate('/validate');
    } catch (error) {
      toast.update(loadingToastId, {
        render: error.response?.data?.message || 'Something went wrong!',
        type: 'error',
        isLoading: false,
        autoClose: 5000,
      });
    }
  };


  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundImage: `url(${backgroundmg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            width: '100vw',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
          }}
        >
          <Container>
            <SignUpContainer $signinIn={signIn}>
              <Form onSubmit={handleFormSubmit}>
                <Title>Create Account</Title>
                <Input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required={!signIn}
                />
                <Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                {!signIn && (
                  <Input
                    type="password"
                    name="password1"
                    placeholder="Confirm Password"
                    value={formData.password1}
                    onChange={handleInputChange}
                    required
                  />
                )}
                <Button type="submit">{signIn ? 'Sign In' : 'Sign Up'}</Button>
                <Anchor onClick={toggle}>
                  Already have an account? Sign In
                </Anchor>
              </Form>
            </SignUpContainer>

            <SignInContainer $signinIn={signIn}>
              <Form onSubmit={handleFormSubmit}>
                <Title>Log In</Title>
                <Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <Anchor href="#">Forgot your password?</Anchor>
                <Button type="submit">Sign In</Button>
                <Anchor onClick={toggle}>Don't have an account? Sign Up</Anchor>
              </Form>
            </SignInContainer>
          </Container>
        </div>
      </div>

      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default Login;
