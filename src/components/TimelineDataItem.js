import React from 'react'

export default function TimelineDataItem({TimelineDatas}) {
  return (
    <div className="timelineChild" >
    <div className="topsize">

        <div className="iconSide">
            <span className="material-symbols-outlined">
                {TimelineDatas.iconName}
            </span>
            
        </div>
        <div className="paraside">
            {TimelineDatas.yearMonth}
        </div>
    </div>
    <div className="infoside">
        <h3>
            {TimelineDatas.heading}
        </h3>
        <p>
            {TimelineDatas.paragraph}
        </p>
    </div>
</div>
  )
}
