import React from 'react'
import AyushImage from '../images/about.jpg'
import laptop from '../images/laptop.jpg'
// img/ayushcolor2.png
export default function Aboutus() {
    return (
        <div className="futurePlans" id="about">

            <div className="inner ">
                <div className="mainImage" data-aos="fade-right" data-aos-duration="500">
                    <img src={AyushImage} alt="" />
                    <div className="boxSmallGradient2  " data-aos="fade-right" data-aos-duration="500" data-aos-delay="300">
                    </div>
                </div>
                <div className="bgGradientBox" data-aos="fade-up" data-aos-duration="500"></div>
                <div className="textBoxSkills" data-aos="fade-left" data-aos-duration="500" data-aos-delay="300">
                    <h2>About Me</h2>
                    <p>Hello There! <br />
I am Ayush Shah from Mumbai, and I love coding websites. I ensure that the entire website is responsive and displays well across different devices. I believe this is just the beginning, and there are many more exciting things to explore in the world of web development.
                    </p>
                    <a href="#contact" className="redmore">Contact Me</a>
                </div>
                <div className="lapiSection" data-aos="fade-down" data-aos-duration="500">
                    <img src={laptop} alt="" />
                </div>
            </div>

        </div>
    )
}
