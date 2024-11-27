import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import customFetch from '../utils/customFetch'; // Axios instance
import { backgroundmg } from '../images';

const Container = styled.div`
  background-color: transparent;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
  width: 40vw;
  max-width: 100%;
  min-height: 30vw;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Form = styled.form`
  background-color: rgba(255, 237, 213, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 20px;
  width: 100%;
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
  width: 80%;
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

const Api = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const apiKey = event.target.apiKey.value;

    if (!apiKey.trim()) {
      toast.error('API Key cannot be empty!');
      return;
    }

    setLoading(true);
    try {
      const response = await customFetch.post('shopify/validate-api-key', {
        apiKey,
      });

      if (response.data.success) {
        toast.success('API Key validated successfully!');
        setTimeout(() => navigate('../dashboard'), 2000); // Redirect after success
      } else {
        toast.error(response.data.message || 'Invalid API Key!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
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
      <ToastContainer />
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
          <Form onSubmit={handleSubmit}>
            <Title>Enter API Key</Title>
            <Input type="text" name="apiKey" placeholder="Enter your API Key" />
            <Button type="submit" disabled={loading}>
              {loading ? 'Validating...' : 'Submit'}
            </Button>
          </Form>
        </Container>
      </div>
    </div>
  );
};

export default Api;
