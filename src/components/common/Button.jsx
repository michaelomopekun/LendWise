export default function Button({ children, onClick, disable, type = "button", varient = "primary",size = "md", className = "" })
{
    const baseStyles = "flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg font-bold leading-normal tracking-[0.015em] transition-colors";

    const varients = {
        primary: "bg-[#1f89e5] text-white hover:bg-[#1a73c4] disabled:opacity-50 disabled:cursor-not-allowed",
        secondary: "bg-[#f0f2f4] text-[#111518] hover:bg-[#e0e3e8] disabled:opacity-50",
        success: "bg-green-100 text-green-800 hover:bg-green-200",
        danger: "bg-red-100 text-red-800 hover:bg-red-200"
    }

    const sizes = {
        sm: "h-8 px-4 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-5 text-base"
    }

    return(
        <button type={type} onClick={onClick} disabled={disable} className={`${baseStyles} ${varients[varient]} ${sizes[size]} ${className}`}>
            <span className="truncate">{children}</span>
        </button>
    )
}