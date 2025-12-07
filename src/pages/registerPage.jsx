import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/AuthPageHeader';
import InputField from '../components/InputField';
import AuthForm from '../components/AuthForm';
import API_ENDPOINTS from '../config/api';



export default function RegisterPage()
{
    const [banks, setBanks] = useState([]);

    const [formData, setFormData] = useState({
        firstName: "", 
        lastName: "", 
        email: "", 
        phoneNumber: "",
        bankId: "",
        password: "", 
        confirmPassword: "",
        income: "",
        occupation: ""
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

        if(!formData.firstName.trim()) 
        {
            newErrors.firstName = "First name is required";
        }

        if(!formData.lastName.trim()) 
        {
            newErrors.lastName = "Last name is required";
        }

        if(!formData.email.trim()) 
        {
            newErrors.email = "Email is required";
        } 
        else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) 
        {
            newErrors.email = "Please enter a valid email address";
        }

        if(!formData.phoneNumber.trim()) 
        {
            newErrors.phoneNumber = "Phone number is required";
        } 
        else if(!/^\d{10,}$/.test(formData.phoneNumber.replace(/\D/g, ''))) 
        {
            newErrors.phoneNumber = "Please enter a valid phone number";
        }

        if(!formData.bankId)
        {
            newErrors.bankId = "Bank name is required";
        }

        if(!formData.password) 
        {
            newErrors.password = "Password is required";
        } 
        else if(formData.password.length < 6) 
        {
            newErrors.password = "Password must be at least 6 characters long";
        }

        if(!formData.confirmPassword) 
        {
            newErrors.confirmPassword = "Please confirm your password";
        } 
        else if(formData.password !== formData.confirmPassword) 
        {
            newErrors.confirmPassword = "Passwords do not match";
        }

        if(!formData.income) 
        {
            newErrors.income = "Annual income is required";
        } 
        else if(isNaN(formData.income) || formData.income <= 0) 
        {
            newErrors.income = "Please enter a valid income amount";
        }

        if(!formData.occupation.trim()) 
        {
            newErrors.occupation = "Occupation is required";
        }

        return newErrors;
    }


    const handleRegister = async (e) => {
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
            const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    bankId: formData.bankId,
                    phoneNumber: formData.phoneNumber,
                    passwordHash: formData.password,
                    occupation: formData.occupation,
                    income: parseInt(formData.income)
                }),
            });

            const data = await response.json();

            if (!response.ok) 
            {
                throw new Error(data.message || 'Registration failed');
            }

            //store the token and redirect to dashboard
            if(data.token)
            {
                localStorage.setItem('token', data.token);
            }

            console.log("Registration successful:", data);

            navigate('/login');
        }
        catch(error)
        {
            setErrors(prev => ({
                ...prev,
                submit: error.message || 'An error occurred during registration.'
            }));

            console.error("Registration error:", error);
        }
        finally
        {
            setLoading(false);
        }

    };

    useEffect(() => {
        fetchBanks();
    }, []);

    const fetchBanks = async () => {
        
        setLoading(true);


        try
        {
            const response = await fetch('http://localhost:2010/api/banks', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();

            if (!response.ok) 
            {
                throw new Error(data.message || 'Failed to fetch banks');
            }

            console.log("Banks fetched successfully:", data);

            setBanks(data);

        }
        catch(error)
        {
            console.error("Registration error:", error);
        }
        finally
        {
            setLoading(false);
        }

    };

    return(
        <AuthForm>

            <Header AdminView={false}/>

            <div className="flex flex-1 justify-center py-5 px-4">

                <div className="layout-content-container flex flex-col w-[512px] max-w-[512px] py-5 flex-1">
                
                    <h2 className="text-[#111518] tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">Create Your Account</h2>

                    {errors.submit && <div className="text-red-500 text-sm px-4 py-2 bg-red-50 rounded-lg mb-3">{errors.submit}</div>}
                    
                    <form onSubmit={handleRegister}>           
                            
                        <div>
                            <InputField label="First Name" type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
                            {errors.firstName && <p className="text-red-500 text-xs px-4 mt-1">{errors.firstName}</p>}
                        </div>
                            
                        <div>
                            <InputField label="Last Name" type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
                            {errors.lastName && <p className="text-red-500 text-xs px-4 mt-1">{errors.lastName}</p>}
                        </div>

                        <div>
                            <InputField label="Email" type="email" name="email" value={formData.email} onChange={handleChange} />
                            {errors.email && <p className="text-red-500 text-xs px-4 mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <InputField label="Phone Number" type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
                            {errors.phoneNumber && <p className="text-red-500 text-xs px-4 mt-1">{errors.phoneNumber}</p>}
                        </div>

                        <div>
                            <label className="text-[#111518] text-sm font-medium leading-normal px-4 block mb-2">Bank Name</label>
                            <select
                                name="bankId" 
                                value={formData.bankId}
                                onChange={handleChange}
                                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111518] focus:outline-0 focus:ring-0 border-none bg-[#f0f2f4] h-14 placeholder:text-[#637788] p-4 text-base font-normal leading-normal"
                            >
                                <option value="">Select your bank</option>
                                {banks.map(bank => (
                                    <option key={bank.id} value={bank.id}>
                                        {bank.bankName}
                                    </option>
                                ))}
                            </select>
                            {errors.bankId && <p className="text-red-500 text-xs px-4 mt-1">{errors.bankId}</p>}
                        </div>


                        <div>
                            <InputField label="Annual Income" type="number" name="income" value={formData.income} onChange={handleChange} />
                            {errors.income && <p className="text-red-500 text-xs px-4 mt-1">{errors.income}</p>}
                        </div>

                        <div>
                            <InputField label="Occupation" type="text" name="occupation" value={formData.occupation} onChange={handleChange} />
                            {errors.occupation && <p className="text-red-500 text-xs px-4 mt-1">{errors.occupation}</p>}
                        </div>

                        <div>
                            <InputField label="Password" type="password" name="password" value={formData.password} onChange={handleChange} />
                            {errors.password && <p className="text-red-500 text-xs px-4 mt-1">{errors.password}</p>}
                        </div>
                        
                        <div>
                            <InputField label="Confirm Password" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
                            {errors.confirmPassword && <p className="text-red-500 text-xs px-4 mt-1">{errors.confirmPassword}</p>}
                        </div>

                        <div className="flex flex-col items-center px-4 py-3">

                            <button type="submit" disabled={loading} className="flex min-w-[84px] max-w-[480px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-[#1f89e5] text-white text-base font-bold leading-normal tracking-[0.015em] disabled:opacity-50 disabled:cursor-not-allowed">
                            
                                <span className="truncate">{loading ? "Signing up..." : "Sign up"}</span>
                            
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

