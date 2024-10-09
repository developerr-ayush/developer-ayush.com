import Link from 'next/link'
import React from 'react'

const Footer = () => {
    return (
        <footer className='footer'>
            <div className="footer-top"><h2>Ayush Shah</h2></div>
            <div className="footer-nav">
                <ul>
                    <li><Link href="/">Home</Link></li>
                    <li><Link href="/about">About</Link></li>
                    <li><Link href="/work">Work</Link></li>
                    <li><Link href="/contact">Contact</Link></li>
                </ul>
            </div>
            <div className="footer-copy">
                <p className="text">Created by <span className="highlight">Ayush Shah</span></p>
            </div>
        </footer>
    )
}

export default Footer