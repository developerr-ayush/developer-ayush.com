// import logo from './logo.svg';
import React, { Component } from "react";
import AOS from "aos";
import "./App.css";
import "../node_modules/aos/dist/aos.css";
import Headers from "./components/header";
import Banner from "./components/banner";
import Threefeatures from "./components/Threefeatures";
import Aboutus from "./components/Aboutus";
import TechFamiler from "./components/TechFamiler";
import Myjourney from "./components/Myjourney";
import Mywork from "./components/Mywork";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import DataWeb from "./images/datawebDesktop.jpg";
import Cuvee from "./images/cuvee.jpg";
import GG from "./images/gg.jpg";
import Finexo from "./images/finexo.jpg";
import Wanderon from "./images/wanderon.jpg";
import Wireframe from "./images/wireframe.jpg";
import Dataviv from "./images/dataviv.jpg";
// import Rixero from './images/rixero.jpg'
import Yoga from "./images/yoga.jpg";
// threre skills
let Threeskills = [
  {
    sno: 1,
    iconName: "view_quilt",
    Text: "Design",
    AnimationType: "fade-right",
    Para: "I have the ability to code almost any kind of design provided. Over the past two years, I have created various types of UI designs, including glass morphism design, dark theme layout, simple design, and many more.",
  },
  {
    sno: 2,
    iconName: "code",
    Text: "Well Maintained Code",
    AnimationType: "fade-up",
    Para: "The code written by me is well-maintained, commented, and properly indented. This ensures that if any further changes are needed, they can be easily implemented.",
  },
  {
    sno: 3,
    iconName: "devices",
    Text: "Fully Responsive Website",
    AnimationType: "fade-left",
    Para: "All of my websites are responsive and compatible with various devices, including desktops, laptops, tablets, and mobiles. I follow a desktop-first approach when coding, which means I initially focus on creating the design for desktop screens and then customize it using media queries to ensure optimal display on other devices.",
  },
];

// timeline
let timelineDate = [
  {
    sno: 0,
    iconName: "work",
    yearMonth: "November 2022 - Present",
    heading: "Front End Developer at Sportz Interactive",
    paragraph:
      "As a Front End Developer at Sportz Interactive, I utilize the SCSS preprocessor to create visually stunning websites. I have enhanced project setups to facilitate seamless development and easy project initialization.",
  },
  {
    sno: 1,
    iconName: "school",
    yearMonth: "July 2022 - Present",
    heading: "Bachelor of Computer Applications (BCA) at Amity Online",
    paragraph:
      "Currently pursuing my undergraduate degree in Computer Applications from Amity Online.",
  },
  {
    sno: 2,
    iconName: "school",
    yearMonth: "December 2021 - Present",
    heading: "Javascript Mastery Course at Hindi Tech Tutorials",
    paragraph:
      "Engaging in an advanced JavaScript course at Hindi Tech Tutorials to enhance my JavaScript skills. During this course, I have worked on several projects that involve complex JavaScript logic.",
  },
  {
    sno: 3,
    iconName: "work",
    yearMonth: "October 2021 - October 2022",
    heading: "Front End Developer at Dataviv Technologies",
    paragraph:
      "Worked as a Front End Developer at Dataviv Technologies, where I developed responsive websites and collaborated with backend developers to integrate website functionality. Additionally, I worked on API-related projects, including API integration and calling.",
  },
  {
    sno: 4,
    iconName: "work",
    yearMonth: "July 2021 - October 2021",
    heading: "Front End Developer Intern at Dataviv Technologies",
    paragraph:
      "Completed a 3-month internship as a Front End Developer at Dataviv Technologies. During the internship, my primary responsibilities included website development and ensuring responsive design across various devices.",
  },
  {
    sno: 5,
    iconName: "school",
    yearMonth: "May 2021",
    heading: "Higher Secondary Certificate (HSC) - Maharashtra Board",
    paragraph:
      "Successfully completed my Higher Secondary Certificate (HSC) from the Maharashtra Board in 2021, achieving 78%.",
  },
  {
    sno: 6,
    iconName: "school",
    yearMonth: "December 2020 - April 2021",
    heading: "Front End Web Development Course at Hindi Tech Tutorials",
    paragraph:
      "Completed a comprehensive front end web development course provided by Rajdeep Dhakad at Hindi Tech Tutorials. Throughout the course, I actively assisted other students in their web development journey.",
  },
];

// Works
let mywork = [
  {
    title: "Yoga",
    skillsUsed: ["HTML5", "Bootstrap", "CSS3", "JavaScript", "jQuery"],
    url: Yoga,
    detail:
      "This website is an assignment given by a company, and one of its notable features is the use of pure CSS to create animated leaf movement. This animation contributes to the website's overall speed and performance.",
    redirectLink: "https://developerr-ayush.github.io/yoga/",
  },
  {
    title: "Dataviv Technologies",
    skillsUsed: ["HTML5", "Bootstrap", "JavaScript", "jQuery", "SCSS"],
    url: Dataviv,
    detail:
      "This website is my own creation for a company, and I must say it turned out to be a visually appealing and impressive website. The animation used in the layout is absolutely fabulous, and I take great pride in designing the color combination and implementing the animations throughout the website.",
    redirectLink: "https://dataviv-technologies.web.app/",
  },
  // {
  //   title: "Rixero",
  //   skillsUsed: ['HTML5', 'CSS3', 'JavaScript', 'jQuery', 'Bootstrap 5'],
  //   url: 'Rixero',
  //   detail: 'This website is a project done by me. I developed the entire front end. Although this website doesn\'t have any animations, it is simple and better. It is one of my freelance works.',
  //   redirectLink: 'https://www.ayushshah.in/work/rixero/index.html'
  // },
  {
    title: "Data Web",
    skillsUsed: ["HTML5", "JavaScript", "jQuery", "SCSS"],
    url: DataWeb,
    detail:
      "I came across this website long after my course, and I decided to replicate it exactly as it is seen. I added a few of my own modifications, such as a sticky navigation and some hover animations.",
    redirectLink: "https://developerr-ayush.github.io/dataweb/",
  },
  {
    title: "Greeting Globe",
    skillsUsed: ["HTML5", "CSS3", "JavaScript", "jQuery", "Bootstrap"],
    url: GG,
    detail:
      "I worked as a team member on this freelance project. I developed approximately 50-60% of the UI, and I also wrote about 90% of the logical parts on this website.",
    redirectLink: "https://greetingglobe-web.web.app/",
  },
  {
    title: "Finexo",
    skillsUsed: ["HTML5", "JavaScript", "jQuery", "SCSS"],
    url: Finexo,
    detail:
      "I created the layout for this website because I liked the UI parts and animations used in it. I personally love the website's layout, design, and UI. I also learned more about CSS animation while working on it.",
    redirectLink: "https://developerr-ayush.github.io/finexo/",
  },
  {
    title: "Cuvee",
    skillsUsed: ["HTML5", "JavaScript", "jQuery", "SCSS"],
    url: Cuvee,
    detail:
      "This was a layout given by a company as an assignment, and I successfully created a clone of the Cuvee website. I replicated the home page with some customized elements as well.",
    redirectLink: "https://developerr-ayush.github.io/cuvee/",
  },
  {
    title: "Wanderon",
    skillsUsed: ["HTML5", "JavaScript", "jQuery", "SCSS"],
    url: Wanderon,
    detail:
      "This website was assigned by a company during an interview round. I learned many new things about the logical part and used various techniques like loops in this layout.",
    redirectLink: "https://developerr-ayush.github.io/wanderon/",
  },
  {
    title: "Wireframe",
    skillsUsed: ["HTML5", "CSS3", "JavaScript", "jQuery", "SCSS"],
    url: Wireframe,
    detail:
      "This website was assigned by a company, and I learned many things about the Owl Carousel while working on this layout. It was a fascinating thing to do.",
    redirectLink: "https://developerr-ayush.github.io/wireframe/",
  },
];

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
        <Banner
          title="Ayush Shah"
          paraText="Hello, I am a front-end web developer from Mumbai. I love to create websites and take on challenges."
        />
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
