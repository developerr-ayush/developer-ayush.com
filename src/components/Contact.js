import React from "react";

export default function Contact() {
  return (
    <div className="contact" id="contact">
      <div className="inner flexbox">
        <div className="header">
          <h3>Contact Me</h3>
        </div>
        <a
          href="/"
          className="designBox red"
          data-aos="fade-right"
          data-aos-duration="500"
        >
          <div className="iconBox">
            <span className="material-symbols-outlined">person_pin_circle</span>
          </div>
          <h6>Mumbai, India</h6>
        </a>
        <a
          href="tel:910000000000"
          className="designBox purple"
          data-aos="fade-down"
          data-aos-duration="500"
        >
          <div className="iconBox">
            <span className="material-symbols-outlined">smartphone</span>
          </div>
          <h6>+91 00000 00000</h6>
        </a>
        <a
          href="mailto:developerr.ayush@gmail.com"
          className="designBox blue"
          data-aos="fade-left"
          data-aos-duration="500"
        >
          <div className="iconBox">
            <span className="material-symbols-outlined">mail</span>
          </div>
          <h6>developerr.ayush@gmail.com</h6>
        </a>
      </div>
    </div>
  );
}
