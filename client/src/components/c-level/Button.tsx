import React from 'react'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps>=(props)=>{
    return <button {...props}/>
}
export default Button;