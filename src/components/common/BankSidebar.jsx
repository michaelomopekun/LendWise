import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HouseIcon, UsersIcon, ApplicationsIcon,HandCoinsIcon, CreditCardIcon, PresentationChartIcon, GearIcon, WalletIcon } from './Icons';



export default function BankSidebar({ activeMenu = 'dashboard', onMenuChange })
{
    const [active, setActive] = useState(activeMenu);
    const navigate = useNavigate();

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: HouseIcon, path: '/bank/dashboard' },
        { id: 'profile', label: 'Profile', icon: UsersIcon, path: '/bank/profile' },
        { id: 'applications', label: 'Applications', icon: ApplicationsIcon, path: '/bank/applications' },
        { id: 'wallet', label: 'Wallet', icon: WalletIcon, path: '/wallet' },
        // { id: 'repayments', label: 'Repayments', icon: CreditCardIcon, path: '/repayment' },
        // { id: 'reports', label: 'Reports', icon: PresentationChartIcon, path: '/reports' }
    ];

    const handleMenuClick = (menuId, path) =>{
        setActive(menuId);
        onMenuChange?.(menuId);
        navigate(path);
    };

    return(
        <div className="w-80 bg-white border-r border-[#dce1e5] flex flex-col">
            <div className="flex h-full min-h-[700px] flex-col justify-between bg-white p-4">
            
                {/* Logo/Title */}
                <div className="flex flex-col gap-4">
                    {/* <h1 className="text-[#111518] text-base font-medium leading-normal">LendWise</h1> */}
                    
                    {/* Menu Items */}
                    <div className="flex flex-col gap-2">
                        {menuItems.map(item => {
                            const IconComponent = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => handleMenuClick(item.id, item.path)} 
                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                                        active === item.id 
                                            ? 'bg-[#f0f2f4]' 
                                            : 'hover:bg-[#f5f5f5]'
                                    }`}
                                >
                                    <div className="text-[#111518]">
                                        <IconComponent size={24} />
                                    </div>
                                    <p className="text-[#111518] text-sm font-medium leading-normal">{item.label}</p>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Settings */}
                <div className="flex flex-col gap-1">
                    <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#f5f5f5] transition-colors" onClick={() => navigate('/settings')}>
                        <div className="text-[#111518]">
                            <GearIcon size={24} />
                        </div>
                        <p className="text-[#111518] text-sm font-medium leading-normal">Settings</p>
                    </button>
                </div>
            </div>
        </div>
    );
}