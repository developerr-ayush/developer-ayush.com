import React from 'react'
import MyworkItem from './MyworkItem'

import OwlCarousel from 'react-owl-carousel';  

import 'owl.carousel/dist/assets/owl.carousel.css';  

import 'owl.carousel/dist/assets/owl.theme.default.css';  

const options={
  margin:50,
  loop:true,
  dotsEach:true,
  responsive: {
    0: {
        items: 1,
    },
    600: {
        items: 2,

    }
},
}
export default function Mywork(props) {
  return (
    <div className="mywork" id="work">
    <div className="inner flexbox">
        <div className="header">
            <h2>
                My Work
            </h2>
            <p>Layouts created by me with techlogies used in that layout</p>
        </div>
        <div className="bgBoxGradient" data-aos="fade-left" data-aos-duration="1000"></div>
        <div className="bgBoxGradient2" data-aos="fade-up" data-aos-duration="500"></div>
        <OwlCarousel
        className='owl-theme workShowCase'
          {...options}
        >
        {
          props.mywork.map((MyworkItems,a)=>{
            return <MyworkItem key={MyworkItems.title} MyworkItems={MyworkItems}/>
          })
        }

        </OwlCarousel>

    </div>
</div>
  )
}
