import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LogoutIcon } from './Common/Icons';

export default function CustomerHeader() 
{
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [userAvatar, setUserAvatar] = useState('https://lh3.googleusercontent.com/aida-public/AB6AXuBXqWEnOvpVtvSpUjrsEdn9LjKhKthyvvWPFhgOZIKk9RnAhgdjI92N9YHaNkRkX-T210-xJdjEauEJ1jXfnNG7bobaomXw3iirHuSFpGHm22Vgjn3dRGq2gq_zqpwJ00SxUW9sA4yn4LW9LPjiIW0ROcr3T_0iXqwa3LQd86r26RxUS4PfTPdS-bU26ZrXmP1PLcbh1aknxZRBtePhbKuIe3Q-yAq2FlZFG8xXaxP7aWCWxcez0kuk9X4wOQULNjm9LUwMgipiRhyn');

    const navigationLinks = [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Loans', path: '/loan/request' },
        { label: 'Repayment', path: '/repayment' },
        // { label: 'Reports', path: '/reports' },
        // { label: 'Settings', path: '/settings' }
    ];

    const handleNavClick = (path) => {
        navigate(path);
        setIsMenuOpen(false);
    };

    const handleLogout = () => {
        // Clear token and user data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Redirect to login
        navigate('/login');
    };

    return (
        <>
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f0f2f4] px-10 py-3">
                
                <div className="flex items-center gap-4 text-[#111518]">
                    <div className="size-4">
                        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z"
                                fill="currentColor"
                            ></path>
                        </svg>
                    </div>
                    <h2 className="text-[#111518] text-lg font-bold leading-tight tracking-[-0.015em]">LendWise</h2>
                </div>

                <div className="flex flex-1 justify-end gap-8 items-center">
                    
                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-9">
                        {/* {navigationLinks.map(link => (
                            <button
                                key={link.path}
                                onClick={() => navigate(link.path)}
                                className="text-[#111518] text-sm font-medium leading-normal hover:text-[#1f89e5] transition-colors"
                            >
                                {link.label}
                            </button>

                        ))} */}
                    </div>

                    {/* User Avatar */}
                    <div
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 cursor-pointer hover:opacity-80 transition-opacity"
                        style={{ backgroundImage: `url("${userAvatar}")` }}
                        onClick={() => navigate('/profile')}
                    ></div>

                {/* Desktop Logout Button */}
                <button
                    onClick={handleLogout}
                    className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors"
                >
                    <LogoutIcon size={16} />
                    Logout
                </button>

                    {/* Hamburger Menu Button - Mobile Only */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden flex flex-col gap-1.5 p-2"
                        aria-label="Toggle menu"
                    >
                        <span className={`block w-6 h-0.5 bg-[#111518] transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                        <span className={`block w-6 h-0.5 bg-[#111518] transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                        <span className={`block w-6 h-0.5 bg-[#111518] transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                    </button>
                </div>
            </header>


            {/* Mobile Navigation Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-b border-solid border-b-[#f0f2f4]">
                    <div className="flex flex-col px-6 py-4 gap-4">
                        {/* {navigationLinks.map(link => (
                            <button
                                key={link.path}
                                onClick={() => handleNavClick(link.path)}
                                className="text-[#111518] text-sm font-medium leading-normal hover:text-[#1f89e5] transition-colors text-left"
                            >
                                {link.label}
                            </button>
                        ))} */}
                        <button
                            onClick={handleLogout}
                            className="text-red-600 text-sm font-medium leading-normal hover:text-red-700 transition-colors text-left border-t border-[#f0f2f4] pt-4 flex items-center gap-2"
                        >
                            <LogoutIcon size={16} />
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}