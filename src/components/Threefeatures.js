import React from 'react'
import ThreefeaturesItem from './ThreefeaturesItem'

export default function Threefeatures(props) {
  return (
    <div className="inner skillsSections flexbox">
        {props.Threeskills.map((Threeskills)=>{
          return <ThreefeaturesItem key={Threeskills.sno} Threeskills={Threeskills} />
        })}
     </div>
  )
}
