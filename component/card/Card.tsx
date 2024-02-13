import React from 'react'
interface CardType {
  className?: string,
  children: React.ReactNode,
}
const Card = ({ className = "", children }: CardType) => {
  return (
    <div className={`card ${className}`} data-aos="zoom-in">
      {children}
    </div>
  )
}

export default Card