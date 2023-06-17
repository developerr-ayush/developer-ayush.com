import React from 'react'

export default function MyworkItem({ MyworkItems }) {
    
    return (
        <div className="workShowing red" data-aos="fade-up" data-aos-duration="500" data-aos-delay="400">
            <div className="imageWrapWork" style={{backgroundImage:`url(${MyworkItems.url}) `}}>

                {/* <img src={MyworkItems.url} alt="" /> */}
            </div>
            <div className="textHover">
                <h4>{MyworkItems.title}</h4>
                <p>
                    <b>Technologies used : </b>

                    

                    {
                        MyworkItems.skillsUsed.map(function(elements){
                            return (<span key={elements}>{elements}</span>)
                        })
                    }
                    

                </p>
                <p>
                    {MyworkItems.detail}
                </p>
                <a href={MyworkItems.redirectLink} taarget="_blank">View Layout</a>
            </div>
        </div>
    )
}
