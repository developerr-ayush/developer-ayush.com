import React from 'react'

export default function header(props) {
    return (

        <nav className=" navbar">
            <div className="inner flexbox">

                <div className="logo">
                    <h1>
                        <a href="#">{props.title}</a>
                    </h1>
                </div>
                <div className="rightNav">
                    <ul className="flexbox" id='mobileNav'>
                        <span className="material-symbols-outlined closeNavBar" onClick={()=>{
                            document.getElementById('mobileNav').classList.remove('navbar-active')
                        }}>
                            close
                        </span>
                        <li><a href="#">Home</a></li>
                        <li><a href="#about">About</a></li>
                        <li><a href="#work">Portfolio</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                </div>
                <div className="hamburger">
                    <span className="material-symbols-outlined meniIcon" onClick={(()=>{
                        document.getElementById('mobileNav').classList.add('navbar-active')
                    })}>
                        menu
                    </span>
                </div>
            </div>
        </nav>
    )
}
