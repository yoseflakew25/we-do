import { ReactElement } from "react";

interface IconInCircleProps {
    icon: ReactElement,
    circleColor?: string,
    bgColor?: string,

}

const IconInCircle: React.FC<IconInCircleProps> = ({ icon, circleColor, bgColor }) => {
    return (
        <div className={`flex items-center justify-center border-2 ${circleColor ? circleColor : "border-neutral20" } ${bgColor ? bgColor : null} w-[40px] h-[40px] rounded-full`}>
            {icon}
        </div>
    );
};

export default IconInCircle;