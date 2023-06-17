import React from 'react'

export default function Contact() {
  return (
    <div className="contact" id="contact">
    <div className="inner flexbox">
        <div className="header">
            <h3>Contact Me</h3>
        </div>
        <a href="" className="designBox red" data-aos="fade-right" data-aos-duration="500">
            <div className="iconBox">
                <span className="material-symbols-outlined">
                    person_pin_circle
                </span>
            </div>
            <h6>Mumbai, India</h6>
        </a>
        <a href="tel:919049877048" className="designBox purple" data-aos="fade-down" data-aos-duration="500">
            <div className="iconBox">
                <span className="material-symbols-outlined">
                    smartphone
                </span>
            </div>
            <h6>+91 90498 77048</h6>
        </a>
        <a href="mailto:shahayush480@gmail.com" className="designBox blue" data-aos="fade-left" data-aos-duration="500">
            <div className="iconBox">
                <span className="material-symbols-outlined">
                    mail
                </span>
            </div>
            <h6>shahayush480@gmail.com</h6>
        </a>
    </div>
</div>

  )
}
