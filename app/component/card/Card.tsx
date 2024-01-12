import React from 'react'
interface CardType {
  className?: string,
  children: React.ReactNode,
}
const Card = ({ className = "", children }: CardType) => {
  return (
    <div className={`card ${className}`}>
      {children}
    </div>
  )
}

export default Card