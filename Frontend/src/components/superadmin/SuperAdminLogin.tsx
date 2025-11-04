// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { Mail, Lock, LogIn, ShieldAlert } from 'lucide-react';

// const SuperAdminLogin: React.FC = () => {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError('');

//     try {
//       const response = await axios.post('http://localhost:5000/api/auth/login', {
//         email,
//         password
//       });

//       // Check if the logged-in user is a super admin
//       if (response.data.admin.role !== 'SuperAdmin') {
//         throw new Error('Access denied. Super Admin privileges required.');
//       }

//       // Save token and admin data
//       localStorage.setItem('token', response.data.token);
//       localStorage.setItem('admin', JSON.stringify(response.data.admin));
      
//       navigate('/super-admin/dashboard');
//     } catch (error: any) {
//       setError(error.response?.data?.message || error.message || 'Login failed');
//     } finally {
//       setIsLoading(false);
//     }
//   };

  
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
//         <div className="flex items-center justify-center mb-6">
//           <ShieldAlert className="h-12 w-12 text-blue-600" />
//         </div>
//         <h1 className="text-2xl font-bold text-center mb-6">Super Admin Login</h1>
        
//         {error && (
//           <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleLogin} className="space-y-4">
//           <div className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700">Email</label>
//             <div className="relative">
//               <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="Enter your email"
//                 required
//               />
//             </div>
//           </div>
          
//           <div className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700">Password</label>
//             <div className="relative">
//               <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="Enter your password"
//                 required
//                 minLength={8}
//               />
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={isLoading}
//             className={`w-full ${
//               isLoading ? 'bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'
//             } text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2`}
//           >
//             {isLoading ? (
//               'Logging in...'
//             ) : (
//               <>
//                 <LogIn className="h-5 w-5" />
//                 Sign In as Super Admin
//               </>
//             )}
//           </button>
//         </form>

//         <button
//           type="button"
//           onClick={() => navigate('/login')}
//           className="w-full mt-4 text-blue-600 hover:text-blue-800"
//         >
//           Back to Admin Login
//         </button>
//       </div>
//     </div>
//   );
// };

// export default SuperAdminLogin;



import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, ShieldAlert, ArrowLeft } from 'lucide-react';

const SuperAdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(import.meta.env.VITE_API_BASE_URL+ '/api/auth/login', {
        email,
        password,
      });

      // Check if the logged-in user is a super admin
      if (response.data.admin.role !== 'SuperAdmin') {
        throw new Error('Access denied. Super Admin privileges required.');
      }

      // Save token and admin data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('admin', JSON.stringify(response.data.admin));

      navigate('/super-admin/dashboard');
    } catch (error: any) {
      setError(error.response?.data?.message || error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-purple-500/10 to-blue-500/10 pointer-events-none"></div>
        <div className="relative">
          <div className="flex items-center justify-center mb-8">
            <div className="p-3 bg-gradient-to-r from-red-500 to-purple-600 rounded-2xl">
              <ShieldAlert className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-center text-white mb-2">Super Admin</h1>
          <p className="text-center text-gray-300 mb-6">Access the control panel</p>

          {error && (
            <div className="mb-4 bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400 transition-colors"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400 transition-colors"
                  placeholder="Enter your password"
                  required
                  minLength={8}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 border border-transparent rounded-lg text-white bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 flex items-center justify-center gap-2 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Logging in...' : <><LogIn className="h-5 w-5" /> Access Control Panel</>}
            </button>
          </form>

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="mt-6 group w-full flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Admin Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLogin;
