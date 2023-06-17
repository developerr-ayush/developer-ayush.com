import React from 'react'

export default function ThreefeaturesItem({Threeskills}) {
    
  return (
    <div className={'skills '+ ' skill'+Threeskills.sno} data-aos={Threeskills.AnimationType} data-aos-duration="700">
            <div className="iconSize">
                <span className="material-symbols-outlined">
                    {Threeskills.iconName}
                </span>
            </div>
                    
            <h3>{Threeskills.Text}</h3>
            <p>{Threeskills.Para}</p>
        </div>
  )
}
