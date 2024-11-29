import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import customFetch from '../utils/customFetch'; // Axios instance
import { backgroundmg } from '../images';

const Container = styled.div`
  background-color: transparent;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
  width: 50vw; /* Adjusted width */
  max-width: 100%;
  min-height: 40vh; /* Increased min-height for better balance */
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2); /* Slight shadow for better visibility */
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
  font-size: 1.5rem; /* Adjusted font size for balance */
`;

const Input = styled.input`
  background-color: rgba(255, 237, 213, 1);
  border: 1px solid brown;
  border-radius: 2vh;
  padding: 12px 15px;
  margin: 8px 0;
  width: 80%;
  font-size: 1rem; /* Adjusted font size */
`;

const Button = styled.button`
  border-radius: 20px;
  background-color: rgba(67, 20, 7, 1);
  color: #ffffff;
  font-size: 14px; /* Adjusted font size for readability */
  font-weight: bold;
  padding: 10px 30px; /* Adjusted padding */
  letter-spacing: 1px;
  text-transform: uppercase;
  margin: 5px 0; /* Added margin to space out buttons */
  width: 80%; /* Limited width */
  max-width: 300px; /* Max width to prevent buttons from stretching */
  transition: transform 80ms ease-in;
  &:active {
    transform: scale(0.95);
  }
  &:focus {
    outline: none;
  }
`;

const ScrollableContainer = styled.div`
  width: 100%;
  max-height: 300px; /* Set a fixed height for scrollable container */
  overflow-y: auto; /* Enable scrolling */
  margin-top: 20px;
`;

const Api = () => {
  const [apiKeys, setApiKeys] = useState([]);
  const [newApiKey, setNewApiKey] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch API keys on mount
  useEffect(() => {
    const fetchApiKeys = async () => {
      try {
        const response = await customFetch.post('/shopify/getAllKeys');
        if (response.data.success) {
          setApiKeys(response.data.data);
        } else {
          toast.error(response.data.message || 'Failed to fetch API keys.');
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || 'Error fetching API keys.'
        );
      }
    };
    fetchApiKeys();
  }, []);

  // Handle API key validation when a button is clicked
  const handleValidateApiKey = async (apiKey) => {
    setLoading(true);
    try {
      const response = await customFetch.post('/shopify/validate-api-key', {
        apiKey,
      });

      if (response.data.success) {
        toast.success('API Key validated successfully!');
        // Handle further actions, like redirecting to another page with the API key
        // For example:
        setTimeout(() => {
          // Redirect to a specific page with the validated API key
          window.location.href = `/dashboard/`; // This can be any URL
        }, 2000);
      } else {
        toast.error(response.data.message || 'Failed to validate API Key!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  // Handle adding a new API key
  const handleAddApiKey = async (event) => {
    event.preventDefault();

    if (!newApiKey.trim()) {
      toast.error('API Key cannot be empty!');
      return;
    }

    setLoading(true);
    try {
      const response = await customFetch.post('/shopify/validate-api-key', {
        apiKey: newApiKey,
      });

      if (response.data.success) {
        toast.success('API Key added successfully!');
        setApiKeys((prevKeys) => [...prevKeys, { stringField: newApiKey }]);
        setNewApiKey('');
      } else {
        toast.error(response.data.message || 'Failed to add API Key!');
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
          <Title>API Keys</Title>

          <ScrollableContainer>
            {apiKeys.map((key, index) => (
              <Button
                key={index}
                onClick={() => handleValidateApiKey(key.stringField)}
              >
                API Key {index + 1}: {key.stringField}
              </Button>
            ))}
          </ScrollableContainer>

          <Form onSubmit={handleAddApiKey}>
            <Input
              type="text"
              value={newApiKey}
              onChange={(e) => setNewApiKey(e.target.value)}
              placeholder="Enter new API Key"
            />
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add API Key'}
            </Button>
          </Form>
        </Container>
      </div>
    </div>
  );
};

export default Api;
