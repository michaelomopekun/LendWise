import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import InputField from '../components/InputField';
import AuthForm from '../components/AuthForm';



export default function RegisterPage(){

    const [formData, setFormData] = useState({name: "", email: "", password: "", confirmPassword: ""});

    const navigate = useNavigate();

    const handleChange = (e) =>{
        const {name, value} =e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRegister = (e) => {
        e.preventDefault();
        //i will add registration logic here
        console.log("Register:", formData);
        //will be redirecting here
    };

    return(
        <AuthForm>

            <Header/>

            <div className="px-40 flex flex-1 justify-center py-5">

                <div className="layout-content-container flex flex-col w-[512px] max-w-[512px] py-5 max-w-[960px] flex-1">
                
                    <h2 className="text-[#111518] tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">Create Your Account</h2>
                    
                    <form onSubmit={handleRegister}>

                        <InputField label="Name" type="text" name="name" value={formData.name} onChange={handleChange} />

                        <InputField label="Email" type="email" name="email" value={formData.email} onChange={handleChange} />

                        <InputField label="Password" type="password" name="password" value={formData.password} onChange={handleChange} />
                        
                        <InputField label="Confirm Password" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />

                        <div className="flex flex-col items-center px-4 py-3">

                            <button type="submit" className="flex min-w-[84px] max-w-[480px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-[#1f89e5] text-white text-base font-bold leading-normal tracking-[0.015em]">
                            
                                <span className="truncate">Sign up</span>
                            
                            </button>
                        
                        </div>

                    </form>

                    <p className="text-[#637788] text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center underline cursor-pointer">
                        Already have an account? 
                        <a href="/login" className="text-[#1f89e5]">Log in</a>
                    </p>

                </div>

            </div>

        </AuthForm>
    )
}