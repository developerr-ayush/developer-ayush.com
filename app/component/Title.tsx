import React from 'react';
import { GiJusticeStar } from "react-icons/gi";
interface title {
    children: React.ReactNode
}
const Title = ({ children }: title) => {
    return (
        <h3 className="flex-center card-heading col-2" data-aos="fade-down">
            <GiJusticeStar style={{ opacity: 0.5 }} />
            {children}
            <GiJusticeStar style={{ opacity: 0.5 }} />
        </h3>
    )
}

export default Title