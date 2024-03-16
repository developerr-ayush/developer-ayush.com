"use client"
import React, { useEffect } from 'react'

const Clock = () => {
    useEffect(() => {
        let hr = document.getElementById("hr");
        let mn = document.getElementById("mn");
        let sc = document.getElementById("sc");

        setInterval(() => {
            let day = new Date();
            let hh = day.getHours() * 30;
            let mm = day.getMinutes() * 6;
            let ss = day.getSeconds() * 6;

            if (sc && hr && mn) {
                hr.style.transform = `rotateZ(${hh + mm / 12}deg)`;
                mn.style.transform = `rotateZ(${mm}deg)`;
                sc.style.transform = `rotateZ(${ss}deg)`;
            }
        })
    }, [])
    return (
        <div className="clock">

            <div className="hour">
                <div className="hr" id="hr" ></div>
            </div>

            <div className="min">
                <div className="mn" id="mn" ></div>
            </div>

            <div className="sec">
                <div className="sc" id="sc" ></div>
            </div>
        </div>
    )
}

export default Clock