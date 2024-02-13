import React from 'react'
interface marquee {
    children: React.ReactNode
}
const Marquee = ({ children }: marquee) => {
    return (
        <div className="marquee">
            <div className="marquee-list">
                {children}
                {children}
            </div>
        </div>
    )
}

export default Marquee