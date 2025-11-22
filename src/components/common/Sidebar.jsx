import { useState } from 'react';
import { HouseIcon, UsersIcon, HandCoinsIcon, CreditCardIcon, PresentationChartIcon, GearIcon } from './Icons';



export default function Sidebar({ activeMenu = 'dashboard', onMenuChange })
{
    const [active, setActive] = useState(activeMenu);

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: HouseIcon },
        { id: 'customers', label: 'Customers', icon: UsersIcon },
        { id: 'loans', label: 'Loans', icon: HandCoinsIcon },
        { id: 'payments', label: 'Payments', icon: CreditCardIcon },
        { id: 'reports', label: 'Reports', icon: PresentationChartIcon }
    ];

    const handleMenuClick = (menuId) =>{
        setActive(menuId);
        onMenuChange?.(menuId);
    };

    return(
        <div className="w-80 bg-white border-r border-[#dce1e5] flex flex-col">
            <div className="flex h-full min-h-[700px] flex-col justify-between bg-white p-4">
                
                {/* Logo/Title */}
                <div className="flex flex-col gap-4">
                    <h1 className="text-[#111518] text-base font-medium leading-normal">LendWise</h1>
                    
                    {/* Menu Items */}
                    <div className="flex flex-col gap-2">
                        {menuItems.map(item => {
                            const IconComponent = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => handleMenuClick(item.id)} 
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
                    <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#f5f5f5] transition-colors">
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