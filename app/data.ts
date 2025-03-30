import {
  FaHtml5,
  FaCss3,
  FaReact,
  FaNodeJs,
  FaGitAlt,
  FaSass,
  FaTwitter,
  FaYoutube,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa";
import { SiMongodb, SiExpress, SiTailwindcss } from "react-icons/si";
import { IoLogoJavascript } from "react-icons/io5";
import { TbBrandNextjs, TbBrandTypescript } from "react-icons/tb";

// Import project images
import aonixv2Image from "./assets/img/work/aonixv2.jpeg";
import datavivImage from "./assets/img/work/dataviv.jpg";
import tradebattleImage from "./assets/img/work/tradebattle.jpeg";
import datawebImage from "./assets/img/work/datawebDesktop.jpg";
import netflixImage from "./assets/img/work/netflix.png";
import schoolvrImage from "./assets/img/work/schoolvr.jpeg";
import aonixImage from "./assets/img/work/aonix.png";
import ggImage from "./assets/img/work/gg.jpg";
import finexoImage from "./assets/img/work/finexo.jpg";
import cuveeImage from "./assets/img/work/cuvee.jpg";
import wanderonImage from "./assets/img/work/wanderon.jpg";
import wireframeImage from "./assets/img/work/wireframe.jpg";
import yogaImage from "./assets/img/work/yoga.jpg";
import slackImage from "./assets/img/work/slack.png";

// Personal Info
export const personalInfo = {
  name: "Ayush Shah",
  title: "UI/UX Developer",
  phone: "+91 90498 77048",
  email: "developerr.ayush@gmail.com",
  github: "https://github.com/developerr-ayush",
  website: "https://developer-ayush.com",
  linkedin: "https://linkedin.com/in/developerr-ayush",
};

// Experience data
export const experienceData = [
  {
    id: 3,
    from: "Sportz Interactive",
    position: "Associate Front End Developer",
    date: "November 2022 - Present",
    para: "Now, at Sportz Interactive, I'm still a Front End Developer. I use a tool called SCSS to make websites look nice. I've taken sessions on coding practices and optimizing our code to improve our skills. Additionally, I've contributed to various internal Sportz projects, bringing my expertise to the team and ensuring our work meets high standards.",
    details: [
      "Built and maintained front-end for high-profile websites such as WPL, ISL, Gujarat Titans, and Rajasthan Royals using HTML, CSS, SASS, SCSS, JavaScript, Gulp and Animations.",
      "Collaborated with the backend (.NET) team to integrate CMS, ensuring smooth content management and development workflow.",
      "Ensured websites' consistency, responsiveness, and accessibility across Safari, Firefox, and Chrome.",
    ],
  },
  {
    id: 2,
    from: "DataViv Technologies",
    position: "Junior Front End Developer",
    date: "November 2021 - October 2022",
    para: "I continued as a Front End Developer at Dataviv for almost a year. I focused on making websites that work well on all devices and fixing any problems. I also worked closely with other developers on 20+ projects, where I learned a lot. I created cool features for over 20 websites using Bootstrap, 10+ with SCSS, and another 10+ with HTML and CSS.",
    details: [
      "Developed the front end of an AI model for Kaya, enabling facial scans to detect skin issues and recommend products.",
      "Built a dashboard for Venya, using Chart.js to create and customize charts for various components.",
      "Created 20+ websites including DatavivTech, Venya, FabFarm, and Stockbee using ReactJS, Bootstrap, jQuery, and ECMAScript.",
      "Worked closely with Python team for data integration, implementing robust authentication and authorization modules",
    ],
  },
  {
    id: 1,
    from: "DataViv Technologies",
    position: "Front End Developer Intern",
    date: "July 2021 - October 2021",
    para: "I completed a 3-month internship at Dataviv Technologies as a Front End Developer. My job was to create websites using bootstraps and custom code, making sure they look good on different devices. I fixed any issues that popped up and worked on more than 10 projects. It was a great learning experience.",
  },
];

// Education data
export const educationData = [
  {
    id: 5,
    from: "Apna College",
    position: "Full Stack Web Development (Delta)",
    date: "June 2023 - December 2023",
    para: "Successfully completed a Full Stack Development course at Apna College, where I gained expertise in the MERN stack. Throughout the course, I acquired valuable knowledge, covering topics such as login authorization, object-oriented programming (OOPs), and the backend workings. This learning experience has significantly enriched my skill set in full stack development.",
  },
  {
    id: 4,
    from: "Amity University",
    position: "Bachelor of Computer Applications (BCA)",
    date: "July 2022 - Present",
    para: "Currently pursuing BCA at Amity University, where I'm gaining foundational knowledge, mainly pursuing it for the degree. Alongside my studies, I initiated a community where I shared insights with others about this field. Currently in the 3rd semester, I aim to continue expanding my understanding of the subject.",
  },
  {
    id: 3,
    from: "CodeEasyAcademy",
    position: "Javascript + React Mastery",
    date: "December 2022 - June 2023",
    para: "Participating in an advanced JavaScript course at Code Easy Academy to boost my JavaScript skills. Throughout the course, I've tackled various projects that required intricate JavaScript logic. Additionally, I've delved into advanced topics such as fetching APIs and handling errors on the front end, broadening my understanding and proficiency in JavaScript.",
  },
  {
    id: 2,
    from: "Maharashtra Board",
    position: "Higher Secondary Certificate (HSC)",
    date: "June 2020 - May 2021",
    para: "Successfully completed my Higher Secondary Certificate (HSC) from the Maharashtra Board in 2021, achieving 78%.",
  },
  {
    id: 1,
    from: "CodeEasyAcademy",
    position: "Front End Web Development Course",
    date: "December 2020 - April 2021",
    para: "Took an extensive front-end web development course led by Rajdeep Dhakad at Hindi Tech Tutorials (Code Easy Academy). Throughout the course, I actively helped fellow students in their web development journey. This experience equipped me with the fundamentals of web development, and I learned a lot during this period of the course.",
  },
];

// Work/Portfolio projects data
export const portfolioData = [
  {
    title: "Aonix v2",
    skillsUsed: ["React", "JavaScript", "HTML5", "SCSS", "CSS3", "EmailJS"],
    image: aonixv2Image,
    detail:
      "Built a dynamic and responsive website using ReactJS, leveraging reusable components for efficient development. Integrated a contact form using EmailJS for direct email communication.",
    redirectLink: "https://aonix-website.netlify.app/",
  },
  {
    title: "Dataviv Technologies",
    skillsUsed: ["HTML5", "Bootstrap", "JavaScript", "jQuery", "SCSS"],
    image: datavivImage,
    detail:
      "This website is my own creation for a company, and I must say it turned out to be a visually appealing and impressive website. The animation used in the layout is absolutely fabulous, and I take great pride in designing the color combination and implementing the animations throughout the website.",
    redirectLink: "https://dataviv-technologies.web.app/",
  },
  {
    title: "Tradebattle",
    skillsUsed: ["React", "JavaScript", "HTML5", "SCSS", "CSS3", "GSAP"],
    image: tradebattleImage,
    detail:
      "Tradebattle is an interactive platform where users can place bets on stock market trends. Built using React, this project integrates dynamic features like scroll-driven animations and a sleek, responsive design. GSAP was used extensively to create smooth animations that enhance the user experience.",
    redirectLink: "https://tradebattle.win/",
  },
  {
    title: "Data Web",
    skillsUsed: ["HTML5", "JavaScript", "jQuery", "SCSS"],
    image: datawebImage,
    detail:
      "I came across this website long after my course, and I decided to replicate it exactly as it is seen. I added a few of my own modifications, such as a sticky navigation and some hover animations.",
    redirectLink: "https://developerr-ayush.github.io/dataweb/",
  },
  {
    title: "Netflix Landing Page",
    skillsUsed: ["React", "JavaScript", "HTML5", "SCSS", "CSS3"],
    image: netflixImage,
    detail:
      "I created a Netflix landing page clone using React. Most of my focus went into the section where videos play. While keeping the design simple, I also addressed some flaws present in the actual Netflix website within this clone.",
    redirectLink: "https://ayush-web-notflix.netlify.app/",
  },
  {
    title: "School VR",
    skillsUsed: ["React", "JavaScript", "HTML5", "SCSS", "CSS3"],
    image: schoolvrImage,
    detail:
      "I built a website using React, and the toughest part was designing it and making dynamic pages. After that, I integrated EmailJs into it. Additionally, I added some small animations throughout the website.",
    redirectLink: "https://schoolvr.netlify.app/",
  },
  {
    title: "Aonix v1",
    skillsUsed: ["React", "JavaScript", "HTML5", "SCSS", "CSS3"],
    image: aonixImage,
    detail:
      "I built a website using React, and the toughest part was designing it and making dynamic pages. After that, I integrated EmailJs into it. Additionally, I added some small animations throughout the website.",
    redirectLink: "https://aonix-project.netlify.app/",
  },
  {
    title: "Greeting Globe",
    skillsUsed: ["HTML5", "CSS3", "JavaScript", "jQuery", "Bootstrap"],
    image: ggImage,
    detail:
      "I worked as a team member on this freelance project. I developed approximately 50-60% of the UI, and I also wrote about 90% of the logical parts on this website.",
    redirectLink: "https://greetingglobe-web.web.app/",
  },
  {
    title: "Finexo",
    skillsUsed: ["HTML5", "JavaScript", "jQuery", "SCSS"],
    image: finexoImage,
    detail:
      "I created the layout for this website because I liked the UI parts and animations used in it. I personally love the website's layout, design, and UI. I also learned more about CSS animation while working on it.",
    redirectLink: "https://developerr-ayush.github.io/finexo/",
  },
  {
    title: "Cuvee",
    skillsUsed: ["HTML5", "JavaScript", "jQuery", "SCSS"],
    image: cuveeImage,
    detail:
      "This was a layout given by a company as an assignment, and I successfully created a clone of the Cuvee website. I replicated the home page with some customized elements as well.",
    redirectLink: "https://developerr-ayush.github.io/cuvee/",
  },
  {
    title: "Wanderon",
    skillsUsed: ["HTML5", "JavaScript", "jQuery", "SCSS"],
    image: wanderonImage,
    detail:
      "This website was assigned by a company during an interview round. I learned many new things about the logical part and used various techniques like loops in this layout.",
    redirectLink: "https://developerr-ayush.github.io/wanderon/",
  },
  {
    title: "Wireframe",
    skillsUsed: ["HTML5", "CSS3", "JavaScript", "jQuery", "SCSS"],
    image: wireframeImage,
    detail:
      "This website was assigned by a company, and I learned many things about the Owl Carousel while working on this layout. It was a fascinating thing to do.",
    redirectLink: "https://developerr-ayush.github.io/wireframe/",
  },
  {
    title: "Yoga",
    skillsUsed: ["HTML5", "Bootstrap", "CSS3", "JavaScript", "jQuery"],
    image: yogaImage,
    detail:
      "This website is an assignment given by a company, and one of its notable features is the use of pure CSS to create animated leaf movement. This animation contributes to the website's overall speed and performance.",
    redirectLink: "https://developerr-ayush.github.io/yoga/",
  },
  {
    title: "Slack Landing page",
    skillsUsed: ["React", "JavaScript", "HTML5", "SCSS", "CSS3"],
    image: slackImage,
    detail:
      "I made a Slack landing page clone using React. The most challenging aspect was the design, particularly the navbar, which took nearly 10 days to perfect. Additionally, I incorporated debouncing functionality into the clone.",
    redirectLink: "https://slack-clone-bg-ayush.netlify.app/",
  },
];

// Skills data
export const skillsData = [
  {
    title: "NextJS",
    icon: TbBrandNextjs,
    color: "#0070f3",
  },
  {
    title: "Typescript",
    icon: TbBrandTypescript,
    color: "#3178c6",
  },
  {
    title: "JavaScript",
    icon: IoLogoJavascript,
    color: "#f7df1e",
  },
  {
    title: "ReactJS",
    icon: FaReact,
    color: "#61dafb",
  },
  {
    title: "MongoDB",
    icon: SiMongodb,
    color: "#4db33d",
  },
  {
    title: "Express",
    icon: SiExpress,
    color: "#000000",
  },
  {
    title: "Node JS",
    icon: FaNodeJs,
    color: "#68a063",
  },
  {
    title: "GIT",
    icon: FaGitAlt,
    color: "#f1502f",
  },
  {
    title: "HTML",
    icon: FaHtml5,
    color: "#e44d26",
  },
  {
    title: "CSS",
    icon: FaCss3,
    color: "#264de4",
  },
  {
    title: "SCSS",
    icon: FaSass,
    color: "#c6538c",
  },
  {
    title: "Tailwind",
    icon: SiTailwindcss,
    color: "#38b2ac",
  },
];

// Services data
export const servicesData = [
  {
    heading: "Website Creation",
    paragraph:
      "Crafting visually appealing and functional websites from scratch that align with your vision and goals. Our team of skilled front-end developers ensures a seamless user experience.",
  },
  {
    heading: "Optimization",
    paragraph:
      "Boosting the performance of existing websites through strategic optimization. From enhancing loading speeds to refining user interfaces, we improve search engine rankings and user satisfaction.",
  },
  {
    heading: "Component-Based Approach",
    paragraph:
      "Implementing a component-based approach in web development for modular and efficient design. This ensures scalability, maintainability, and reusability of code components across the website.",
  },
  {
    heading: "Color Theming with Variables",
    paragraph:
      "Utilizing variables throughout the website for color theming. This allows for easy customization and consistency in maintaining the visual aesthetics of your brand or project.",
  },
  {
    heading: "Dark Mode Options",
    paragraph:
      "Providing users with the option to switch to dark mode for a comfortable and visually pleasing experience, especially in low-light environments. Enhancing accessibility and user preference.",
  },
  {
    heading: "Responsive Designs",
    paragraph:
      "Creating websites with responsive designs that seamlessly adapt to various devices. Ensuring a consistent and optimal user experience, whether accessed on a desktop, tablet, or smartphone.",
  },
];

// Projects data
export const projectsData = [
  {
    title: "Aonix Website",
    date: "Oct '23 - Dec '22",
    details: [
      "Worked with designers to understand animation and flow requirements.",
      "Developed a carousel-based animation for products fetched through JSON.",
      "Improved abilities in crafting visually appealing and responsive websites using ReactJS, Swiper, Context API, and Sass.",
    ],
  },
  {
    title: "Admin Panel",
    date: "Jan '24 - Feb '24",
    details: [
      "Created a full-stack admin panel using Prisma, SQL, AWS, and Cloudinary for the backend, and NextJS, Auth.js, Tailwind, and a rich text editor for the frontend.",
      "Enabled non-programmers to easily publish blogs, enhancing accessibility and usability.",
      "Used Amazon Web Services to store images, utilizing its node package AWS-SDK.",
    ],
  },
];

// Achievements data
export const achievementsData = [
  {
    title: "Hackathon @ Sportz Interactive",
    date: "Jan '24 - Feb '24",
    description:
      "Developed a cricket-based Snake and Ladder game with a team of 5, securing 2nd place out of 6 teams by rapidly prototyping the UI and game logic within 2 days, and overcoming significant challenges in board traversal and movement.",
  },
];

// Social media links
export const socialLinks = [
  {
    name: "GitHub",
    url: "https://github.com/developerr-ayush",
    icon: FaGithub,
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com/in/developerr-ayush",
    icon: FaLinkedin,
  },
  {
    name: "Twitter",
    url: "https://x.com/developerrayush",
    icon: FaTwitter,
  },
  {
    name: "YouTube",
    url: "http://youtube.com/ayushshah",
    icon: FaYoutube,
  },
];
