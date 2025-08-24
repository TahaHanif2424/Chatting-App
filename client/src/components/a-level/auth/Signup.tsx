import { useFormik } from 'formik';
import Input from '../../c-level/Input';
import Button from '../../c-level/Button';
import { signupSchema } from './Schema';
import { signup } from './functions';
import type { AuthProp } from './types';
import { useState } from 'react';
import AvatarSelector from '../../b-level/Avatar-Selector';
import { useNavigate } from 'react-router-dom';


export default function Signup({ changeMode }: AuthProp) {
  const [display, setDisplay] = useState(false);
  const [avatar, setAvatar] = useState("");
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
      values.avatar=avatar;
      const response=await signup(values);
      if(response){
        navigate("/auth?mode=login")
      }else{
        throw new Error("Invalid Credentials");
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
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg min-h-[400px]">
      <h2 className="text-2xl font-bold text-[#111827] text-center mb-6">Sign Up</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-[#111827] font-semibold mb-1">Email</label>
          <Input
            type="email"
            name="email"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${errors.email && values.email ? 'border-red-500 focus:ring-red-500 bg-red-50' : 'border-[#64748B]  focus:ring-[#14B8A6] bg-white'} focus:outline-none focus:ring-2`}
            placeholder="Enter your email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
        </div>
        <div>
          <label className="block text-[#111827] font-semibold mb-1">Name</label>
          <Input
            type="text"
            name="name"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${errors.name && values.name ? 'border-red-500 focus:ring-red-500 bg-red-50' : 'border-[#64748B]  focus:ring-[#14B8A6] bg-white'} focus:outline-none focus:ring-2`}
            placeholder="Enter your name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />

        </div>
        <div>
          <label className="block text-[#111827] font-semibold mb-1">Password</label>
          <Input
            type="password"
            name="password"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${errors.password && values.password ? 'border-red-500 focus:ring-red-500 bg-red-50' : 'border-[#64748B]  focus:ring-[#14B8A6] bg-white'} focus:outline-none focus:ring-2`}
            placeholder="Enter your password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
        </div>
        <div>
          <label className="block text-[#111827] font-semibold mb-1">Confirm Password</label>
          <Input
            type="password"
            name="confirmPassword"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${errors.confirmPassword && values.confirmPassword ? 'border-red-500 focus:ring-red-500 bg-red-50' : 'border-[#64748B]  focus:ring-[#14B8A6] bg-white'} focus:outline-none focus:ring-2`}
            placeholder="Enter your password"
            value={values.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          <Button
            className="w-full bg-cyan-100 text-black py-2 rounded-lg hover:bg-cyan-100 transition-colors cursor-pointer mt-6"
            onClick={handleDisplay}
          >
            Select Avatar
          </Button>
        </div>
        <Button
          type="submit"
          className="w-full bg-[#1E3A8A] text-white py-2 rounded-lg hover:bg-[#1E40AF] transition-colors cursor-pointer"
        >
          Sign Up
        </Button>
      </form>
      <p className="text-center text-[#111827] mt-4">
        Already have an account?{" "}
        <Button
          className="text-[#1E3A8A] hover:underline font-medium cursor-pointer"
          onClick={changeMode}
        >
          Login
        </Button>
      </p>
    </div>
  );

}
