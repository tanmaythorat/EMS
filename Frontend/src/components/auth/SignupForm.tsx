import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Building } from 'lucide-react';

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  role: string;
  companyName: string;
}

const SignupForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignupFormData>({
    name: '',
    email: '',
    password: '',
    role: 'Admin', // Default role as per your requirement
    companyName: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_BASE_URL+ '/api/auth/register',
        formData
      );
      
      if (response.status === 201) {
        alert('Registration successful!');
        navigate('/login');
      }
    } catch (error: any) {
      setError(
        error.response?.data?.error || 
        error.response?.data?.message || 
        'Registration failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-green-900">JOIN US</h2>
        <p className="text-gray-600 mt-2">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-yellow-600 font-semibold hover:underline"
          >
            Sign In
          </button>
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="pl-10 w-full p-2 border-b-2 border-yellow-500 focus:outline-none"
            placeholder="Full Name"
            required
          />
        </div>

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

        <div className="relative">
          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            className="pl-10 w-full p-2 border-b-2 border-yellow-500 focus:outline-none"
            placeholder="Company Name"
            required
          />
        </div>

        {/* Hidden role field (defaults to 'Admin' as per your requirement) */}
        <input type="hidden" name="role" value="Admin" />

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full ${
            isLoading ? 'bg-yellow-600' : 'bg-yellow-500 hover:bg-yellow-600'
          } text-green-900 py-3 rounded-lg font-semibold transition duration-300`}
        >
          {isLoading ? 'Processing...' : 'SIGN UP'}
        </button>
      </form>
    </div>
  );
};

export default SignupForm;