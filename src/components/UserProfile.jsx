export default function UserProfile({ userName = "Ethan Harper", customerId = "789012", joinedDate = "2021-11-20", avatarUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuBXqWEnOvpVtvSpUjrsEdn9LjKhKthyvvWPFhgOZIKk9RnAhgdjI92N9YHaNkRkX-T210-xJdjEauEJ1jXfnNG7bobaomXw3iirHuSFpGHm22Vgjn3dRGq2gq_zqpwJ00SxUW9sA4yn4LW9LPjiIW0ROcr3T_0iXqwa3LQd86r26RxUS4PfTPdS-bU26ZrXmP1PLcbh1aknxZRBtePhbKuIe3Q-yAq2FlZFG8xXaxP7aWCWxcez0kuk9X4wOQULNjm9LUwMgipiRhyn" }) 
{
    return (
        <div className="flex p-4 flex-col gap-4 md:flex-row md:justify-between md:items-center">
            <div className="flex gap-4">
                {/* <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-32 h-32 flex-shrink-0"
                    style={{
                        backgroundImage: `url("${avatarUrl}")`
                    }}
                ></div> */}
                <div className="flex flex-col justify-center">
                    <p className="text-[#111518] text-[22px] font-bold leading-tight tracking-[-0.015em]">Hey, Welcome Back!</p>
                    {/* <p className="text-[#637788] text-base font-normal leading-normal">Customer ID: {customerId}</p>
                    <p className="text-[#637788] text-base font-normal leading-normal">Joined: {joinedDate}</p> */}
                </div>
            </div>
        </div>
    );
}