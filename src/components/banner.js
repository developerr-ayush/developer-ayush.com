import React from 'react'
import Ayush from '../images/ayushcolor1.jpg'
import PropTypes from 'prop-types';
export default function banner(props) {
    return (
        <header className="banner">
            <div className="inner">
                <div className="threeBoxOne  " data-aos="fade-right" data-aos-duration="800"></div>
                <div className="threeBoxTwo  " data-aos="fade-down" data-aos-duration="800"></div>
                <div className="threeBoxThree  " data-aos="fade-left" data-aos-duration="800"></div>

                <div className="textArea  " data-aos="fade-up" data-aos-duration="500" data-aos-delay="700">

                    <h1>{props.title}</h1>
                    <p>
                        {props.paraText}
                    </p>
                    <a href="#about">
                        Learn More
                    </a>
                </div>
                <div className="imageWrapper  " data-aos="fade-up" data-aos-duration="500" data-aos-delay="1000">

                    <img src={Ayush} alt="" />
                    <div className="boxSmallGradient  " data-aos="fade-down" data-aos-duration="1500"></div>
                </div>

            </div>
        </header>

    )
}
banner.propTypes = {
    title: PropTypes.string,
    paraText: PropTypes.string,
}