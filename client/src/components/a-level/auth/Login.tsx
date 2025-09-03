import { useState } from 'react'
import Input from '../../c-level/Input'
import Button from '../../c-level/Button'
import { useFormik } from 'formik';
import { loginSchema } from './Schema';
import { login } from './functions';
import type { AuthProp } from './types';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, Loader2 } from 'lucide-react';


export default function Login({ changeMode }:AuthProp) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { values, errors, handleChange, handleSubmit, handleBlur } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async(values) => {
     setIsLoading(true);
     try {
       const response = await login(values);
       if (response) {
         localStorage.setItem('currentUser', JSON.stringify({
           id: response.loggedInUserId,
           email: values.email
         }));
         // Navigate to dashboard after successful login
         setTimeout(() => {
           navigate('/dashboard');
         }, 500);
       }
     } catch (error) {
       console.error('Login failed:', error);
     } finally {
       setIsLoading(false);
     }
    }
  });

  return (
    <div className="relative bg-white/95 backdrop-blur-md p-12 rounded-3xl shadow-2xl w-full max-w-lg border border-purple-100 animate-fade-in">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-pink-500/10 rounded-3xl"></div>
      <div className="relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex p-4 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-lg mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Welcome Back</h2>
          <p className="text-gray-500 mt-2">Sign in to continue to ChatApp</p>
        </div>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 font-medium mb-2 text-base">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="email"
                name="email"
                className={`w-full pl-12 pr-4 py-2 text-base border-2 rounded-xl transition-all duration-200 ${
                  errors.email && values.email 
                    ? 'border-red-400 bg-red-50 focus:border-red-500' 
                    : 'border-gray-200 hover:border-purple-300 focus:border-purple-500 bg-white'
                } focus:outline-none focus:ring-4 focus:ring-purple-500/20`}
                placeholder="you@example.com"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
            </div>
            {errors.email && values.email && (
              <p className="text-red-500 text-sm mt-2">{errors.email}</p>
            )}
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2 text-base">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="password"
                name="password"
                className={`w-full pl-12 pr-4 py-2 text-base border-2 rounded-xl transition-all duration-200 ${
                  errors.password && values.password
                    ? 'border-red-400 bg-red-50 focus:border-red-500' 
                    : 'border-gray-200 hover:border-purple-300 focus:border-purple-500 bg-white'
                } focus:outline-none focus:ring-4 focus:ring-purple-500/20`}
                placeholder="Enter your password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
            </div>
            {errors.password && values.password && (
              <p className="text-red-500 text-sm mt-2">{errors.password}</p>
            )}
          </div>
          
          <div className="mt-6">
            <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 text-base rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Sign In
              </>
            )}
            </Button>
          </div>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-base">
            Don't have an account?{" "}
            <Button
              className="text-purple-600 hover:text-purple-700 font-semibold cursor-pointer transition-colors"
              onClick={changeMode}
            >
              Create Account
            </Button>
          </p>
        </div>
      </div>
    </div>
  )
}