import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/AuthPageHeader';
import InputField from '../components/InputField';
import AuthForm from '../components/AuthForm';

export default function BankLoginPage(){

    const [formData, setFormData] = useState({
        email: "", 
        password: ""
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) =>{
        const {name, value} =e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if(errors[name])
        {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };


    const validateForm = () => 
    {
        const newErrors = {};

        if(!formData.email.trim()) 
        {
            newErrors.email = "Email is required";
        } 
        else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) 
        {
            newErrors.email = "Please enter a valid email address";
        }

        if(!formData.password) 
        {
            newErrors.password = "Password is required";
        } 
        else if(formData.password.length < 6) 
        {
            newErrors.password = "Password must be at least 6 characters long";
        }

        return newErrors;
    }


    const handleLogin = async (e) => {
        e.preventDefault();
        
        const newErrors = validateForm();

        if(Object.keys(newErrors).length > 0)
        {
            setErrors(newErrors);

            return;
        }

        setErrors({});

        setLoading(true);

        try
        {
            const response = await fetch('http://localhost:2010/api/auth/bankLogin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contactEmail: formData.email,
                    passwordHash: formData.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) 
            {
                throw new Error(data.message || 'Login failed');
            }

            //store the token and redirect to dashboard
            if(data.token)
            {
                localStorage.setItem('token', data.token);
            }

            console.log("Login successful:", data);

            navigate('/bank/dashboard');
        }
        catch(error)
        {
            setErrors(prev => ({
                ...prev,
                submit: error.message || 'An error occurred during login.'
            }));

            console.error("login error:", error);
        }
        finally
        {
            setLoading(false);
        }
        // console.log("Login:", { email, password });
        // After successful login, navigate to dashboard
    };

    return(
        <AuthForm>

            <Header AdminView={false}/>

            <div className="flex flex-1 justify-center py-5 px-4">

                <div className="layout-content-container flex flex-col w-[512px] max-w-[512px] py-5 flex-1">

                        <h2 className="text-[#111518] tracking-light text-[28px] font-bold leading-tight px-4 text-center pd-3 pt-5">Bank's Loan Officer Login</h2>

                        {errors.submit && <div className="text-red-500 text-sm px-4 py-2 bg-red-50 rounded-lg mb-3">{errors.submit}</div>}

                        <form onSubmit={handleLogin}>
                            <div>
                                <InputField label="Email" type="email" name="email" value={formData.email} onChange={handleChange} />
                                {errors.email && <p className="text-red-500 text-xs px-4 mt-1">{errors.email}</p>}
                            </div>

                            <div>
                                <InputField label="Password" type="password" name="password" value={formData.password} onChange={handleChange} />
                                {errors.password && <p className="text-red-500 text-xs px-4 mt-1">{errors.password}</p>}
                            </div>

                            <p className="text-[#637788] text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center underline">Forgot password?</p>

                            <div className="flex flex-col items-center px-4 py-3">

                                <button type="submit" disabled={loading} className="flex min-w-[84px] max-w-[480px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-[#1f89e5] text-white text-base font-bold leading-normal tracking-[0.015em] disabled:opacity-50 disabled:cursor-not-allowed">
                                
                                    <span className="truncate">{loading ? "Logging in..." : "Log in"}</span>
                                
                                </button>
                            
                            </div>

                        </form>

                        <p className="text-[#637788] text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center underline cursor-pointer">
                            Don't have an account? 
                            <a href="/onboard/bank" className="text-[#1f89e5]">Sign up</a>
                        </p>

                    </div>
                    
            </div>

        </AuthForm>
    )

}