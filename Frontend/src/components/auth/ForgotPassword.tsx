import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Mail, Key, Lock } from 'lucide-react';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState<'email' | 'otp' | 'reset'>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await axios.post(import.meta.env.VITE_API_BASE_URL+ '/api/auth/forgot-password/request-otp', { email });
      setSuccessMessage('OTP sent to your email');
      setStep('otp');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await axios.post(import.meta.env.VITE_API_BASE_URL+ '/api/auth/forgot-password/verify-otp', { 
        email, 
        otp 
      });
      setSuccessMessage('OTP verified successfully');
      setStep('reset');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await axios.post(import.meta.env.VITE_API_BASE_URL+ '/api/auth/forgot-password/reset', {
        email,
        newPassword
      });
      setSuccessMessage('Password reset successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Password reset failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-green-900">RESET PASSWORD</h2>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {successMessage}
        </div>
      )}

      {step === 'email' && (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 w-full p-2 border-b-2 border-yellow-500 focus:outline-none"
              placeholder="Enter your registered email"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full ${
              isLoading ? 'bg-yellow-600' : 'bg-yellow-500 hover:bg-yellow-600'
            } text-green-900 py-3 rounded-lg font-semibold transition duration-300`}
          >
            {isLoading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>
      )}

      {step === 'otp' && (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="relative">
            <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="pl-10 w-full p-2 border-b-2 border-yellow-500 focus:outline-none"
              placeholder="Enter 6-digit OTP"
              required
              maxLength={6}
              pattern="\d{6}"
              title="Please enter exactly 6 digits"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full ${
              isLoading ? 'bg-yellow-600' : 'bg-yellow-500 hover:bg-yellow-600'
            } text-green-900 py-3 rounded-lg font-semibold transition duration-300`}
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
      )}

      {step === 'reset' && (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="pl-10 w-full p-2 border-b-2 border-yellow-500 focus:outline-none"
              placeholder="Enter new password"
              required
              minLength={8}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full ${
              isLoading ? 'bg-yellow-600' : 'bg-yellow-500 hover:bg-yellow-600'
            } text-green-900 py-3 rounded-lg font-semibold transition duration-300`}
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      )}

      <button
        onClick={() => navigate('/login')}
        className="w-full text-gray-600 hover:underline text-center"
      >
        Back to Login
      </button>
    </div>
  );
};

export default ForgotPassword;