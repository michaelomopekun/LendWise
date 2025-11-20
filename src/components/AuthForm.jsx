export default function AuthForm({children, onSubmit}){
    return(
        <div className="relative flex h-auto min-h-screen w-full flex-col bg-white group/design-root overflow-x-hidden" style={{ fontFamily: "Inter, 'Noto Sans', sans-serif" }}>
            <div className="layout-container flex h-full grow flex-col">
                {children}
            </div>
        </div>
    )
}