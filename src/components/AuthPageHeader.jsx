import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function AuthPageHeader({ AdminView }) {

    const isAdminView = AdminView;
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const authLinks = [
        { label: 'Get Started', path: '/register', style: 'bg-[#1f89e5] text-white' },
        { label: 'Log in as a Customer', path: '/login', style: 'bg-[#f0f2f4] text-[#111518]' },
        { label: 'Log in as a Bank', path: '/bankLogin', style: 'bg-[#f0f2f4] text-[#111518]' },
    ];

    let excludeFromAdminView = null;

    if (!isAdminView) {
        excludeFromAdminView = (
            <div className="hidden lg-custom:flex gap-2">
                {authLinks.map(link => (
                    <Link
                        key={link.path}
                        to={link.path}
                        className={`flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 text-sm font-bold leading-normal tracking-[0.015em] ${link.style}`}
                    >
                        <span className="truncate">{link.label}</span>
                    </Link>
                ))}
            </div>
        );
    }

    return (
        <>
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f0f2f4] px-10 py-3">

                <div className="flex items-center gap-4 text-[#111518]">
                    <div className="size-4">
                        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 42.4379C4 42.4379 14.0962 36.0744 24 41.1692C35.0664 46.8624 44 42.2078 44 42.2078L44 7.01134C44 7.01134 35.068 11.6577 24.0031 5.96913C14.0971 0.876274 4 7.27094 4 7.27094L4 42.4379Z" fill="currentColor"></path>
                        </svg>
                    </div>
                    <h2 className="text-[#111518] text-lg font-bold leading-tight tracking-[-0.015em]">LoanEase</h2>
                </div>

                <div className="flex flex-1 justify-end gap-8 items-center">
                    {excludeFromAdminView}

                    {/* Hamburger Menu Button - Mobile Only */}
                    {!isAdminView && (
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg-custom:hidden flex flex-col gap-1.5 p-2"
                            aria-label="Toggle menu"
                        >
                            <span className={`block w-6 h-0.5 bg-[#111518] transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                            <span className={`block w-6 h-0.5 bg-[#111518] transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                            <span className={`block w-6 h-0.5 bg-[#111518] transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                        </button>
                    )}
                </div>

            </header>

            {/* Mobile Navigation Menu */}
            {isMenuOpen && !isAdminView && (
                <div className="lg-custom:hidden bg-white border-b border-solid border-b-[#f0f2f4]">
                    <div className="flex flex-col px-6 py-4 gap-3">
                        {authLinks.map(link => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={`flex items-center justify-center overflow-hidden rounded-lg h-10 px-4 text-sm font-bold leading-normal tracking-[0.015em] ${link.style}`}
                            >
                                <span className="truncate">{link.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}