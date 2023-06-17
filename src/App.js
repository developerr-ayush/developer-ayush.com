// import logo from './logo.svg';
import React, { Component } from 'react';
import AOS from 'aos';
import './App.css';
import '../node_modules/aos/dist/aos.css';
import Headers from './components/header'
import Banner from './components/banner'
import Threefeatures from './components/Threefeatures'
import Aboutus from './components/Aboutus'
import TechFamiler from './components/TechFamiler'
import Myjourney from './components/Myjourney'
import Mywork from './components/Mywork'
import Contact from './components/Contact'
import Footer from './components/Footer'
import DataWeb from './images/datawebDesktop.jpg'
import Cuvee from './images/cuvee.jpg'
import GG from './images/gg.jpg'
import Finexo from './images/finexo.jpg'
import Wanderon from './images/wanderon.jpg'
import Wireframe from './images/wireframe.jpg'
import Dataviv from './images/dataviv.jpg'
import Rixero from './images/rixero.jpg'
import Yoga from './images/yoga.jpg'
// threre skills 
let Threeskills = [
  {
    sno: 1,
    iconName: "view_quilt",
    Text: "Design",
    AnimationType: 'fade-right',
    Para: "I can code almost any kind of design provided, from last 2 years created many types of UI like glass morphism design, dark theme layout, Simple Design, and much more.",
  },
  {
    sno: 2,
    iconName: "code",
    Text: "Well Maintained Code",
    AnimationType: 'fade-up',
    Para: 'Code written by me is well maintained and commented also proper indentation is also done so that if further changes is needed then it can be done very easily.'
  },
  {
    sno: 3,
    iconName: "devices",
    Text: "Fully Responsive Website",
    AnimationType: 'fade-left',
    Para: 'My all websites are responsive in almost all devices like Desktop, Laptop, Tablet and Mobiles. I use desktop first approach means first its coded for desktop and after that other devices are customised using Media Queries'
  },

]

// timeline 
let timelineDate = [
  {
    sno: 1,
    iconName: 'school',
    yearMonth: 'July 2022 - Present',
    heading: 'BCA - Amity Online',
    paragraph: 'Doing my undergrad degree from Amity online',
  },
  {
    sno: 2,
    iconName: 'school',
    yearMonth: 'December 2021 - Present',
    heading: 'Javascript Mastery - Hindi Tech Tutorials',
    paragraph: 'Learning Advance JS by this course and during this time worked on many projects which have some complex Javascript logic',
  },
  {
    sno: 3,
    iconName: 'work',
    yearMonth: 'October 2021 - Present',
    heading: 'Front End Developer - Dataviv Technologies',
    paragraph: 'Make responsive website and help in integration of website with backend developer. Also work on API related project like calling api and integrating it on website',
  },
  {
    sno: 4,
    iconName: 'work',
    yearMonth: 'July 2021 - October 2021',
    heading: 'Front End Developer Intern - Dataviv Technologies',
    paragraph: 'Done 3 month internship in which my main work was to make website and make sure each websites are responsive in all devices',
  },
  {
    sno: 5,
    iconName: 'school',
    yearMonth: 'May 2021',
    heading: 'HSC Passed - Maharashtra Board',
    paragraph: 'I have completed My HSC in 2021 and i got 78% in HSC',
  },
  {
    sno: 6,
    iconName: 'school',
    yearMonth: 'December 2020  -  April 2021',
    heading: 'FRONT END WEB DEV COURSE - HINDI TECH TUTORIALS',
    paragraph: 'Completed front end web development course provided by rajdeep dhakad and during course i have also helped many students in their web development journey',
  },



]

// Works 
let mywork = [
  {
    title: "Yoga",
    skillsUsed: ['HTML5', 'Bootstrap', 'css3','javascript', 'jquery'],
    url: Yoga,
    detail: 'This website is also an assignment given by some company. most important thing in this website is animation created using pure css the leaf moving animation which also makes this website very fast.',
    redirectLink: 'https://www.ayushshah.in/work/yoga/index.html'
  },
  {
    title: "Dataviv Technologies",
    skillsUsed: ['HTML5', 'Bootstrap', 'javascript', 'jquery', 'scss'],
    url: Dataviv,
    detail: 'This website is companies website created by me and this is one of the good looking website created by me. Animation used in this layout is fabulaus and seriously main thing i like in this was design colour combination and animation whole thing is created by me.',
    redirectLink: 'https://dataviv-technologies.web.app/'
  },
  // {
  //   title: "Rixero",
  //   skillsUsed: ['HTML5', 'css3', 'javascript', 'jquery', 'Bootstrap 5'],
  //   url: Rixero,
  //   detail: 'This website is a project done by me whole front end is developed by me. Also this is one of the website of my freelance work as such this website dont have any kind of animation but yet simple and better website it is.',
  //   redirectLink: 'https://www.ayushshah.in/work/rixero/index.html'
  // },
  {
    title: "Data Web",
    skillsUsed: ['HTML5', 'javascript', 'jquery', 'scss'],
    url: DataWeb,
    detail: 'This website i created long after my course i just found this on some website and replicated exactly same as it is seen also i added few things on my own too like navigation sticky and few hover animations too',
    redirectLink: 'https://www.ayushshah.in/work/dataweb/index.html'
  },
  {
    title: "Greeting Globe",
    skillsUsed: ['HTML5', 'css3', 'javascript', 'jquery', 'bootstrap'],
    url: GG,
    detail: 'This is a freelace project in which i was a team member and almost 50-60% ui is developed by me only and others also contributed over here also 90% of logical part is written by me on this website.',
    redirectLink: 'https://greetingglobe-web.web.app/'
  },
  
  {
    title: "Finexo",
    skillsUsed: ['HTML5', 'javascript', 'jquery', 'scss'],
    url: Finexo,
    detail: 'This website layput i just maked because i just like the ui part and animations used in this website also i personally love the website layout , design and ui. I learnt more about css animation over here',
    redirectLink: 'https://www.ayushshah.in/work/finexo/index.html'
  },
  {
    title: "Cuvee",
    skillsUsed: ['HTML5', 'javascript', 'jquery', 'scss'],
    url: Cuvee,
    detail: 'This was layout given by some company as assignment and i created it and it is really good although it is also a replication of websit only it is cuvee website clone just home page is been replicated with some customised thing too.',
    redirectLink: 'https://www.ayushshah.in/work/cuvee/index.html'
  },
  
  {
    title: "Wanderon",
    skillsUsed: ['HTML5', 'javascript', 'jquery', 'scss'],
    url: Wanderon,
    detail: 'This website is also an assignment given by some company in interview round and actually i learnt many new things in logical part, used many stuffs like loops in this layout.',
    redirectLink: 'https://www.ayushshah.in/work/wanderon/index.html'
  },
  {
    title: "Wireframe",
    skillsUsed: ['HTML5', 'css3', 'javascript', 'jquery', 'scss'],
    url: Wireframe,
    detail: 'This website is also an assignment given by some company in this layout i actually learn many things about owl carousel which is really facinating thing to do.',
    redirectLink: 'https://www.ayushshah.in/work/wireframe/index.html'
  },
  

]
// function app(){

// }
class App extends Component {

  constructor(props, context) {
    super(props, context);
    AOS.init();
  }

  componentWillReceiveProps() {
    AOS.refresh();
  }


  render() {
    return (
      <>
        <Headers title="Ayush Shah" />
        <Banner title="Ayush Shah" paraText="Hello i am Front End Web Developer from Mumbai, Loves to create websites and take challenges" />
        <Threefeatures Threeskills={Threeskills} />
        <Aboutus />
        <TechFamiler />
        <Myjourney TimelineDataArray={timelineDate} />
        <Mywork mywork={mywork} />
        <Contact />
        <Footer />
      </>
    );
  }
}


export default App;
