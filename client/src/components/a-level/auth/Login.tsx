// import React, { useState } from 'react'
import Input from '../../c-level/Input'
import Button from '../../c-level/Button'
import { useFormik } from 'formik';
import { loginSchema } from './Schema';
import { login } from './functions';
import type { AuthProp } from './types';


export default function Login({ changeMode }:AuthProp) {

  const { values, errors, handleChange, handleSubmit, handleBlur } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async(values) => {
     const response = await login(values);
     if (response) {
       localStorage.setItem('currentUser', JSON.stringify({
         id: response.loggedInUserId,
         email: values.email
       }));
     }
    }
  });

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg min-h-[370px]">
      <h2 className="text-2xl font-bold text-[#111827] text-center mb-6">Login</h2>
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
          <label className="block text-[#111827] font-semibold mb-1">Password</label>
          <Input
            type="password"
            name="password"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${errors.password && values.password? 'border-red-500 focus:ring-red-500 bg-red-50' : 'border-[#64748B]  focus:ring-[#14B8A6] bg-white'} focus:outline-none focus:ring-2`}
            placeholder="Enter your password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-[#1E3A8A] text-white py-2 rounded-lg hover:bg-[#1E40AF] transition-colors cursor-pointer"
        >
          Login
        </Button>
      </form>
      <p className="text-center text-[#111827] mt-4">
        Do not have an account?{" "}
        <Button
          className="text-[#1E3A8A] hover:underline font-medium cursor-pointer"
          onClick={changeMode}
        >
          Sign Up
        </Button>
      </p>
    </div>
  )
}