export default function LoanCardSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="flex items-stretch justify-between gap-4 rounded-lg bg-white p-4 shadow-[0_0_4px_rgba(0,0,0,0.1)]">
                <div className="flex flex-[2_2_0px] flex-col gap-4 w-full">
                    <div className="flex flex-col gap-1">
                        <div className="h-6 bg-gray-200 rounded w-48"></div>
                        <div className="h-4 bg-gray-200 rounded w-full mt-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6 mt-1"></div>
                    </div>
                    <div className="h-8 bg-gray-200 rounded w-24"></div>
                </div>
            </div>
        </div>
    );
}