import React from 'react'
import html from '../images/htmlIcon.png'
import css from '../images/css.png'
import js from '../images/js.png'
import jquery from '../images/jquery.png'
import scss from '../images/icons8-sass-150.png'
import bootstrap from '../images/bootstrap.png'
import react from '../images/react.png'

export default function TechFamiler() {
  return (
    <div className="language">

        <div className=" inner flexbox">
            <div className="div heading">
                <h2>Technologies I am <span> Familier With</span></h2>
            </div>
            <div className="div knowingDetails red" data-aos="fade-up" data-aos-duration="500">
                <div className="iconOrImage">
                    <img src={html} alt=""/>
                </div>
                <h3>HTML</h3>
                <p>HyperText Markup Language is used for creating structure for website.</p>
            </div>
            <div className="div knowingDetails purple" data-aos="fade-down" data-aos-duration="500">
                <div className="iconOrImage">
                    <img src={css} alt=""/>
                </div>
                <h3>CSS</h3>
                <p>Cascading style sheet is used for styling elements on webiste.</p>
            </div>
            <div className="div knowingDetails red" data-aos="fade-up" data-aos-duration="500">
                <div className="iconOrImage">
                    <img src={bootstrap} alt=""/>
                </div>
                <h3>Bootstrap</h3>
                <p>CSS library used to make work very easy. you just have to use classes.  </p>
            </div>
            <div className="div knowingDetails purple" data-aos="fade-down" data-aos-duration="500">
                <div className="iconOrImage">
                    <img src={js} alt=""/>
                </div>
                <h3>JS</h3>
                <p>Javascript is used for adding logic to our webisite and also used for dynamic data using API.</p>
            </div>
            <div className="div knowingDetails red" data-aos="fade-up" data-aos-duration="500">
                <div className="iconOrImage">
                    <img src={jquery} alt=""/>
                </div>
                <h3>jquery</h3>
                <p>Javascript library used to write javascript logic very easily.</p>
            </div>
            <div className="div knowingDetails purple" data-aos="fade-down" data-aos-duration="500">
                <div className="iconOrImage">
                    <img src={scss} alt=""/>
                </div>
                <h3>Scss</h3>
                <p>Preprocessor used to write css very fast and easily also its fast too.</p>
            </div>
            <div className="div knowingDetails red" data-aos="fade-down" data-aos-duration="500">
                <div className="iconOrImage">
                    <img src={react} alt=""/>
                </div>
                <h3>Reactjs</h3>
                <p><br/> Still in learning phase :) <br/></p>
            </div>
        </div>
    </div>
  )
}
