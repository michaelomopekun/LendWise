import {Link} from 'react-router-dom';

export default function Header() {
    return(
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f0f2f4] px-10 py-3">

            <div className="flex items-center gap-4 text-[#111518]">
            
                <div className="size-4">
            
                    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            
                        <path d="M4 42.4379C4 42.4379 14.0962 36.0744 24 41.1692C35.0664 46.8624 44 42.2078 44 42.2078L44 7.01134C44 7.01134 35.068 11.6577 24.0031 5.96913C14.0971 0.876274 4 7.27094 4 7.27094L4 42.4379Z" fill="currentColor"></path>
            
                    </svg>
            
                </div>
            
                <h2 className="text-[#111518] text-lg font-bold leading-tight tracking-[-0.015em]">LoanEase</h2>
            
            </div>

            <div className="flex flex-1 justify-end gap-8">
            
                <div className="flex items-center gap-9">
            
                    <a href="#" className="text-[#111518] text-sm font-medium leading-normal">Personal</a>
            
                    <a href="#" className="text-[#111518] text-sm font-medium leading-normal">Personal</a>
            
                    <a href="#" className="text-[#111518] text-sm font-medium leading-normal">Personal</a>
            
                </div>
            
                <div className="flex gap-2">
            
                    <Link to="/register" className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#1f89e5] text-white text-sm font-bold leading-normal tracking-[0.015em]">
            
                        <span className="truncate">Get Started</span>
            
                    </Link>
            
                    <Link to="/login" className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#f0f2f4] text-[#111518] text-sm font-bold leading-normal tracking-[0.015em]">
            
                        <span className="truncate">Log in</span>
            
                    </Link>
            
                </div>
            
            </div>
        
        </header>
    )
}