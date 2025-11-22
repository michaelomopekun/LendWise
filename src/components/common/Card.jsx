export default function Card({children, className = "", title, subtitle})
{
    return(
        <div className={`rounded-lg border border-[#dce1e5] p-6 bg-white ${className}`}>
        
            {title && <h3 className="text-[#111518] text-base font-medium leading-normal mb-2">{title}</h3>}
        
            {subtitle && <p className="text-[#637788] text-sm font-normal leading-normal mb-4">{subtitle}</p>}
        
            {children}
        
        </div>
    )
}