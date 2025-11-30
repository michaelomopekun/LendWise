import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import Header from '../components/AuthPageHeader';
import CustomerHeader from '../components/CustomerHeader';
import Sidebar from '../components/Common/Sidebar';
import Button from '../components/Common/Button';
import InputField from '../components/InputField';

export default function LoanApplicationPage() 
{
    const [activeMenu, setActiveMenu] = useState('loans');
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        loanAmount: '',
        loanType: '',
        loanTerm: '',
        notes: ''
    });

    const [errors, setErrors] = useState({});
    const [loanTypes, setLoanTypes] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchLoanTypes();
    }, []);

    const fetchLoanTypes = async () => {
        
        setLoading(true);

        try
        {
            const token = localStorage.getItem('token');

            if (!token) 
            {
                setErrors(prev => ({
                    ...prev,
                    submit: 'Authentication token not found. Please log in again.'
                }));
                setLoading(false);
                return;
            }

            const response = await fetch(`http://localhost:2010/api/loans/types`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) 
            {
                throw new Error(data.message || 'Failed to fetch loan types');
            }

            console.log("Loan Types fetched successfully:", data);

            // Handle different API response formats
            setLoanTypes(Array.isArray(data) ? data : (data.loanTypes || []));

        }
        catch(error)
        {
            console.error("Fetch loan types error:", error);
            setErrors(prev => ({
                ...prev,
                submit: error.message || 'Failed to load loan types'
            }));
        }
        finally
        {
            setLoading(false);
        }

    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.loanAmount.trim()) 
        {
            newErrors.loanAmount = 'Loan amount is required';
        } 
        else if (isNaN(formData.loanAmount) || parseFloat(formData.loanAmount) <= 0) 
        {
            newErrors.loanAmount = 'Please enter a valid loan amount';
        }

        if (!formData.loanType) 
        {
            newErrors.loanType = 'Loan type is required';
        }

        if (!formData.loanTerm.trim()) 
        {
            newErrors.loanTerm = 'Loan term is required';
        } 
        else if (isNaN(formData.loanTerm) || parseInt(formData.loanTerm) <= 0) 
        {
            newErrors.loanTerm = 'Please enter a valid loan term';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = validateForm();

        if (Object.keys(newErrors).length > 0) 
        {
            setErrors(newErrors);
            return;
        }

        setLoading(true);

        try 
        {
            const token = localStorage.getItem('token');

            if (!token) 
            {
                setErrors(prev => ({
                    ...prev,
                    submit: 'Authentication token not found. Please log in again.'
                }));
                setLoading(false);
                return;
            }

            const response = await fetch('http://localhost:2010/api/loans', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    amount: parseFloat(formData.loanAmount),
                    loan_typeId: formData.loanType,
                    tenureMonth: parseInt(formData.loanTerm),
                })
            });

            const data = await response.json();

            if (!response.ok) 
            {
                throw new Error(data.message || 'Failed to submit loan application');
            }

            console.log('Loan application submitted successfully:', data);
            
            // Reset form
            setFormData({
                loanAmount: '',
                loanType: '',
                loanTerm: '',
                notes: ''
            });

            // Navigate to dashboard
            navigate('/dashboard');

        } 
        catch (error) 
        {
            setErrors(prev => ({
                ...prev,
                submit: error.message || 'An error occurred while submitting the application.'
            }));
            console.error('Loan application error:', error);
        } 
        finally 
        {
            setLoading(false);
        }
    };

    const handleMenuChange = (menuId) => {
        setActiveMenu(menuId);
    };

    return (
        <div className="flex h-screen w-full bg-white font-['Inter','Noto Sans',sans-serif]">
            <Sidebar activeMenu={activeMenu} onMenuChange={handleMenuChange} />

            <div className="flex-1 overflow-auto flex flex-col">
                <CustomerHeader/>

                <div className="flex-1 overflow-auto">
                    <div className="flex flex-wrap justify-between gap-3 p-4">
                        <p className="text-[#111518] tracking-light text-[32px] font-bold leading-tight min-w-72">New Loan Application</p>
                    </div>

                    {errors.submit && (
                        <div className="mx-4 mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-800 text-sm font-medium">{errors.submit}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>

                        <InputField
                            label="Loan Amount"
                            name="loanAmount"
                            type="number"
                            placeholder="Enter Loan Amount"
                            value={formData.loanAmount}
                            onChange={handleChange}
                        />
                        {errors.loanAmount && <p className="text-red-500 text-xs px-4 max-w-[480px] mx-auto">{errors.loanAmount}</p>}

                        <div className="flex flex-col items-center gap-4 px-4 py-3">
                            <label className="flex flex-col w-full max-w-[480px]">
                                <p className="text-[#111518] text-base font-medium leading-normal pb-2">Loan Type</p>
                                <select
                                    name="loanType"
                                    value={formData.loanType}
                                    onChange={handleChange}
                                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111518] focus:outline-0 focus:ring-0 border-none bg-[#f0f2f4] h-14 placeholder:text-[#637788] p-4 text-base font-normal leading-normal"
                                >
                                    <option value="">Select Loan Type</option>
                                    {loanTypes.map(type => (
                                        <option key={type.id} value={type.id}>
                                            {type.name}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>
                        {errors.loanType && <p className="text-red-500 text-xs px-4 max-w-[480px] mx-auto">{errors.loanType}</p>}

                        <InputField
                            label="Loan Term (Months)"
                            name="loanTerm"
                            type="number"
                            placeholder="Enter Loan Term"
                            value={formData.loanTerm}
                            onChange={handleChange}
                        />
                        {errors.loanTerm && <p className="text-red-500 text-xs px-4 max-w-[480px] mx-auto">{errors.loanTerm}</p>}
                        

                        <div className="flex flex-col items-center gap-4 px-4 py-3">
                            <label className="flex flex-col w-full max-w-[480px]">
                                <p className="text-[#111518] text-base font-medium leading-normal pb-2">Notes</p>
                                <textarea
                                    name="notes"
                                    placeholder="Enter any additional notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111518] focus:outline-0 focus:ring-0 border-none bg-[#f0f2f4] min-h-36 placeholder:text-[#637788] p-4 text-base font-normal leading-normal"
                                />
                            </label>
                        </div>

                        <div className="flex px-4 py-3 justify-center">
                            <Button type="submit" size="lg" disabled={loading}>
                                {loading ? 'Submitting...' : 'Submit Application'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}