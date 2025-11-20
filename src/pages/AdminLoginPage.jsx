import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import InputField from '../components/InputField';
import AuthForm from '../components/AuthForm';

export default function AdminLoginPage(){

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");
    
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        //login logic here
        console.log("AdminLogin:", { email, password });
        // After successful login, navigate to dashboard
    };

    return(
        <AuthForm>

            <Header AdminView={true} />

            <div className="px-40 flex flex-1 justify-center py-5">

                    <div className="layout-content-container flex flex-col w-[512px] max-w-[512px] py-5 max-w-[960px] flex-1">

                        <h2 className="text-[#111518] tracking-light text-[28px] font-bold leading-tight px-4 text-center pd-3 pt-5">Loan Officer Login</h2>

                        <form onSubmit={handleLogin}>
                            <InputField placeholder = "Email" type = "email" value={email} onChange={(e) => setEmail(e.target.value)} />

                            <InputField placeholder = "Password" type = "password" value={password} onChange={(e) => setPassword(e.target.value)} />

                            <p className="text-[#637788] text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center underline">Forgot password?</p>

                            <div className="flex flex-col items-center px-4 py-3">
                                <button type="submit" className="flex min-w-[84px] max-w-[480px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-[#1f89e5] text-white text-base font-bold leading-normal tracking-[0.015em]">
                                    <span className="truncate">Log in</span>
                                </button>
                            </div>

                        </form>

                        {/* <p className="text-[#637788] text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center underline cursor-pointer">
                            Don't have an account? 
                            <a href="/register" className="text-[#1f89e5]">Sign up</a>
                        </p> */}

                    </div>
                    
            </div>

        </AuthForm>
    )

}