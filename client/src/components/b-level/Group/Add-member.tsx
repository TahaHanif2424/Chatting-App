import React from 'react'
import Input from '../../c-level/Input'
import ListofUsers from '../List-of-Users'

export default function AddMember() {
    
  return (
    <div>
        <div>
            <Input type="text"
            name="text"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none border-[#64748B]  focus:ring-[#14B8A6] bg-white focus:outline-none focus:ring-2`}
            placeholder="Enter your email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            required />
            <div>
            <ListofUsers />
            </div>
        </div>
        <div>

        </div>
    </div>
  )
}
