import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/AuthPageHeader';
import InputField from '../components/InputField';
import AuthForm from '../components/AuthForm';



export default function BankRegisterPage()
{

    const [formData, setFormData] = useState({
        bankName: "", 
        licenseNumber: "",
        head_office_address: "",
        contactEmail: "",
        contactPhone: "",
        password: "", 
        confirmPassword: "",
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

        if(!formData.bankName.trim()) 
        {
            newErrors.bankName = "Bank name is required";
        }

        if(!formData.licenseNumber.trim()) 
        {
            newErrors.licenseNumber = "License number is required";
        }

        if(!formData.contactEmail.trim()) 
        {
            newErrors.contactEmail = "Email is required";
        } 
        else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) 
        {
            newErrors.contactEmail = "Please enter a valid email address";
        }

        if(!formData.contactPhone.trim()) 
        {
            newErrors.contactPhone = "Phone number is required";
        } 
        else if(!/^\d{10,}$/.test(formData.contactPhone.replace(/\D/g, ''))) 
        {
            newErrors.contactPhone = "Please enter a valid phone number";
        }

        if(!formData.head_office_address.trim()) 
        {
            newErrors.head_office_address = "Head office address is required";
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
            const response = await fetch('http://localhost:2010/api/auth/bank/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bankName: formData.bankName,
                    licenseNumber: formData.licenseNumber,
                    headOfficeAddress: formData.head_office_address,
                    contactEmail: formData.contactEmail,
                    contactPhone: formData.contactPhone,
                    passwordHash: formData.password,
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

            navigate('/bank/login');
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

    return(
        <AuthForm>

            <Header AdminView={false}/>

            <div className="flex flex-1 justify-center py-5 px-4">

                <div className="layout-content-container flex flex-col w-[512px] max-w-[512px] py-5 flex-1">
                
                    <h2 className="text-[#111518] tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">Create Your Bank's Account</h2>

                    {errors.submit && <div className="text-red-500 text-sm px-4 py-2 bg-red-50 rounded-lg mb-3">{errors.submit}</div>}
                    
                    <form onSubmit={handleRegister}>           
                            
                        <div>
                            <InputField label="Bank Name" type="text" name="bankName" value={formData.bankName} onChange={handleChange} />
                            {errors.bankName && <p className="text-red-500 text-xs px-4 mt-1">{errors.bankName}</p>}
                        </div>
                            
                        <div>
                            <InputField label="License Number" type="text" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} />
                            {errors.licenseNumber && <p className="text-red-500 text-xs px-4 mt-1">{errors.licenseNumber}</p>}
                        </div>
                        
                        <div>
                            <InputField label="Head Office Address" type="text" name="head_office_address" value={formData.head_office_address} onChange={handleChange} />
                            {errors.head_office_address && <p className="text-red-500 text-xs px-4 mt-1">{errors.head_office_address}</p>}
                        </div>
                        

                        <div>
                            <InputField label="Email" type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} />
                            {errors.contactEmail && <p className="text-red-500 text-xs px-4 mt-1">{errors.contactEmail}</p>}
                        </div>

                        <div>
                            <InputField label="Phone Number" type="tel" name="contactPhone" value={formData.contactPhone} onChange={handleChange} />
                            {errors.contactPhone && <p className="text-red-500 text-xs px-4 mt-1">{errors.contactPhone}</p>}
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
                        <a href="/bank/login" className="text-[#1f89e5]">Log in</a>
                    </p>

                </div>

            </div>

        </AuthForm>
    )
}

