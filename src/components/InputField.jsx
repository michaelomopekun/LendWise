export default function InputField({label, placeholder, type = "text", value, onChange, name, className="flex flex-col items-center gap-4 px-4 py-3"}){

    return(
    
        <div className={className}>
        
            <label className="flex flex-col w-full max-w-[480px] ">
    
                {label && <p className="text-[#111518] text-base font-medium leading-normal pb-2">{label}</p> }
    
                <input type={type} name={name} placeholder={placeholder} value={value} onChange={onChange} className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111518] focus:outline-0 focus:ring-0 border-none bg-[#f0f2f4] h-14 placeholder:text-[#637788] p-4 text-base font-normal leading-normal" />
    
            </label>
        
        </div>
    )
}