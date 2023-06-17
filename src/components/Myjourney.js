import React from 'react'
import image1 from '../images/ayushcolor3.jpg'
import image2 from '../images/ayushcolor4.jpg'
import image3 from '../images/ayushcolor5.jpg'
import TimelineDataItem from './TimelineDataItem'

export default function Myjourney(props) {

  return (
    <div className="mentor">
        <div className="inner">
            <div className="leftSidetext" data-aos="fade-right" data-aos-duration="500">
                <h2>My Journey
                </h2>
                <p>
                    <b>
                        No one understand why your degree matters as compared to skills for most of companies.
                    </b>
                </p>
                <div className="timeline " id="timelineDynamic" data-aos="fade-right" data-aos-duration="500" data-aos-delay="400">
                    
                    {props.TimelineDataArray.map((TimelineData)=>{

                        return <TimelineDataItem key={TimelineData.sno} TimelineDatas={TimelineData} />
                    })}
                </div>
                <a href="img/resume.pdf" className="learnMoreTimeline">
                    Resume
                </a>
            </div>
            <div className="rightBoxOne" data-aos="fade-up" data-aos-duration="500"></div>
            <div className="imgone" data-aos="fade-down" data-aos-duration="500" data-aos-delay="300">
                <img src={image1} alt=""/>
            </div>
            <div className="imgtwo" data-aos="fade-right" data-aos-duration="500" data-aos-delay="500">
                <img src={image2} alt=""/>
            </div>
            <div className="imgthree" data-aos="fade-up" data-aos-duration="500" data-aos-delay="700">
                <img src={image3} alt=""/>
            </div>
        </div>
        <div className="backgroundBox" data-aos="slide-right" data-aos-duration="500"></div>
    </div>
  )
}
