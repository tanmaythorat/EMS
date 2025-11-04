import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { Mail, Lock, LogIn } from 'lucide-react';

interface LoginFormData {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const handleGoogleLoginSuccess = async (credentialResponse: any) => {
  //   try {
  //     const response = await axios.post(
  //       'http://localhost:5000/api/users/google-login',
  //       { token: credentialResponse.credential }
  //     );
  //     localStorage.setItem('token', response.data.token);
  //     navigate('/post-login');
  //   } catch (error) {
  //     setError('Google login failed. Please try again.');
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

try {
  const response = await axios.post(
import.meta.env.VITE_API_BASE_URL + '/api/auth/login',    formData
  );

      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // <GoogleOAuthProvider clientId="745418085662-kli1oqlmoqppfgovmmdc55l9a8nrh87u.apps.googleusercontent.com">
      <div className="w-full  space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-green-900">WELCOME</h2>
          <p className="text-gray-600 mt-2">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="text-yellow-600 font-semibold hover:underline"
            >
              Sign Up
            </button>
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="pl-10 w-full p-2 border-b-2 border-yellow-500 focus:outline-none"
                placeholder="Email"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="pl-10 w-full p-2 border-b-2 border-yellow-500 focus:outline-none"
                placeholder="Password"
                required
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/forgot-password')}
            className="text-sm text-gray-600 hover:underline"
          >
            Forgot Password?
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full ${
              isLoading ? 'bg-yellow-600' : 'bg-yellow-500 hover:bg-yellow-600'
            } text-green-900 py-3 rounded-lg font-semibold transition duration-300 flex items-center justify-center gap-2`}
          >
            {isLoading ? 'Processing...' : (
              <>
                <LogIn className="h-5 w-5" />
                LOGIN
              </>
            )}
          </button>

          <div className="flex justify-center mt-4">
            {/* <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={() => setError('Google login failed')}
              theme="filled_blue"
              shape="pill"
            /> */}
          </div>
        </form>

        <button
          onClick={() => navigate('/super-admin')}
          className="w-full bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-900"
        >
          Super Admin Login
        </button>
      </div>
    // </GoogleOAuthProvider>
  );
};

export default LoginForm;