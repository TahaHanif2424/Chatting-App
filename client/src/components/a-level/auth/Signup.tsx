import { useFormik } from 'formik';
import Input from '../../c-level/Input';
import Button from '../../c-level/Button';
import { signupSchema } from './Schema';
import { signup } from './functions';
import type { AuthProp } from './types';
import { useState } from 'react';
import AvatarSelector from '../../b-level/Avatar-Selector';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, Loader2, Image } from 'lucide-react';


export default function Signup({ changeMode }: AuthProp) {
  const [display, setDisplay] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate=useNavigate();

  const { values, errors, handleChange, handleSubmit, handleBlur } = useFormik({
    initialValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
      avatar: ""
    },
    validationSchema: signupSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        values.avatar=avatar;
        const response=await signup(values);
        if(response){
          navigate("/auth?mode=login")
        }else{
          throw new Error("Invalid Credentials");
        }
      } finally {
        setIsLoading(false);
      }
    }
  })

  const handleDisplay = () => {
    if (!display) {
      setDisplay(true);
    }
  }

  if (display) {
    return <AvatarSelector avatar={setAvatar} display={setDisplay}/>
  }
  return (
    <div className="relative bg-white/95 backdrop-blur-md px-12 py-6 rounded-3xl shadow-2xl w-full max-w-lg border border-purple-100 animate-fade-in">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-pink-500/10 rounded-3xl"></div>
      <div className="relative z-10">
        <div className="text-center mb-4">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Join ChatApp</h2>
          <p className="text-gray-500 mt-2">Start connecting today</p>
        </div>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
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
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2 text-base">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                name="name"
                className={`w-full pl-12 pr-4 py-2 text-base border-2 rounded-xl transition-all duration-200 ${
                  errors.name && values.name 
                    ? 'border-red-400 bg-red-50 focus:border-red-500' 
                    : 'border-gray-200 hover:border-purple-300 focus:border-purple-500 bg-white'
                } focus:outline-none focus:ring-4 focus:ring-purple-500/20`}
                placeholder="John Doe"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
            </div>
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
                placeholder="Create a password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2 text-base">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="password"
                name="confirmPassword"
                className={`w-full pl-12 pr-4 py-2 text-base border-2 rounded-xl transition-all duration-200 ${
                  errors.confirmPassword && values.confirmPassword
                    ? 'border-red-400 bg-red-50 focus:border-red-500' 
                    : 'border-gray-200 hover:border-purple-300 focus:border-purple-500 bg-white'
                } focus:outline-none focus:ring-4 focus:ring-purple-500/20`}
                placeholder="Confirm your password"
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
            </div>
          </div>
          
          <div className="mt-5 space-y-3">
            <Button
              type="button"
              onClick={handleDisplay}
              className="w-full bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 py-3 text-sm rounded-xl font-medium hover:from-gray-200 hover:to-gray-300 transition-all flex items-center justify-center gap-2 mb-3"
            >
              <Image className="w-4 h-4" />
              {avatar ? 'Avatar Selected' : 'Select Avatar'}
            </Button>
            
            <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 text-sm rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                Create Account
              </>
            )}
            </Button>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-base">
            Already have an account?{" "}
            <Button
              className="text-purple-600 hover:text-purple-700 font-semibold cursor-pointer transition-colors"
              onClick={changeMode}
            >
              Sign In
            </Button>
          </p>
        </div>
      </div>
    </div>
  );

}
