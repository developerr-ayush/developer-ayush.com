import {
  FaHtml5,
  FaCss3,
  FaReact,
  FaNodeJs,
  FaGitAlt,
  FaSass,
  FaLinkedin,
  FaGithub,
  FaEnvelope,
  FaPhoneAlt,
  FaGlobe,
} from "react-icons/fa";
import {
  SiMongodb,
  SiExpress,
  SiTailwindcss,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
} from "react-icons/si";

export const personalInfo = {
  name: "Ayush Shah",
  title: "UI/UX & Front-End Developer",
  phone: "+91 90498 77048",
  email: "developerr.ayush@gmail.com",
  github: "https://github.com/developerr-ayush",
  portfolio: "https://developer-ayush.com",
  linkedin: "https://linkedin.com/in/developerr-ayush",
  summary:
    "Highly motivated and skilled UI/UX and Front-End Developer with a strong foundation in ReactJS, NextJS, and related technologies. Proven ability to build and maintain high-profile websites and dashboards, integrate with backend systems, and deliver visually appealing and user-friendly solutions. Experienced in collaborating with cross-functional teams and adept at problem-solving.",
};

export const skills = {
  frontend: [
    "ReactJS",
    "NextJS",
    "Tailwind",
    "Bootstrap",
    "Sass",
    "HTML",
    "CSS",
    "JavaScript",
    "TypeScript",
  ],
  backend: ["Node.js", "SQL", "Prisma", "MongoDB", "Express", "EJS", "AWS"],
  tools: ["Git", "GSAP", "Chart.js"],
  languages: ["Java (Data Structures and Algorithms)"],
  accessibility: ["General knowledge of WCAG standards and practices"],
};

export const experience = [
  {
    id: 1,
    company: "Sportz Interactive",
    position: "UI/UX Developer",
    location: "Mumbai",
    period: "Nov 2022 - Present",
    responsibilities: [
      "Built and maintained front-end for high-profile sports websites including WPL, ISL, Gujarat Titans, and Rajasthan Royals, using HTML, CSS, SASS/SCSS, JavaScript, Gulp, and animations.",
      "Collaborated with the backend (.NET) team to integrate CMS, ensuring smooth content management and development workflow.",
      "Ensured websites' consistency, responsiveness, and accessibility across Safari, Firefox, and Chrome.",
    ],
  },
  {
    id: 2,
    company: "Dataviv Technologies",
    position: "Front-End Developer",
    location: "Mumbai",
    period: "July 2021 - Oct 2022",
    responsibilities: [
      "Developed the front-end of an AI model for Kaya, enabling facial scans to detect skin issues and recommend products.",
      "Built a dashboard for Venya, utilizing Chart.js to create and customize charts for various components.",
      "Developed over 20 websites including DatavivTech, Venya, FabFarm, and Stockbee using ReactJS, Bootstrap, jQuery, and ECMAScript.",
      "Collaborated with the Python team for data integration, implementing robust authentication and authorization modules.",
    ],
  },
];

export const projects = [
  {
    id: 1,
    title: "Aonix Website",
    period: "Oct 2023 - Dec 2023",
    description:
      "Collaborated with designers to understand animation and flow requirements. Developed a carousel-based animation for products fetched through JSON. Enhanced skills in creating visually appealing and responsive websites using ReactJS, Swiper, Context API, and Sass.",
    technologies: ["ReactJS", "Swiper", "Context API", "Sass"],
  },
  {
    id: 2,
    title: "Admin Panel",
    period: "Jan 2024 - Feb 2024",
    description:
      "Developed a full-stack admin panel using Prisma, SQL, AWS, and Cloudinary for the backend, and NextJS, Auth.js, Tailwind, and a rich text editor for the frontend. Enabled non-programmers to easily publish blogs, enhancing accessibility and usability. Utilized Amazon Web Services to store images, using the AWS-SDK node package.",
    technologies: [
      "NextJS",
      "Prisma",
      "SQL",
      "AWS",
      "Cloudinary",
      "Auth.js",
      "Tailwind",
    ],
  },
];

export const achievements = [
  {
    id: 1,
    title: "Hackathon @ Sportz Interactive",
    period: "Jan 2024 - Feb 2024",
    description:
      "Developed a cricket-based Snake and Ladder game with a team of 5, securing 2nd place out of 6 teams. Rapidly prototyped the UI and game logic within 2 days, overcoming challenges in board traversal and movement.",
  },
];

export const portfolioWorks = [
  {
    id: 1,
    title: "Aonix v2",
    technologies: ["React", "JavaScript", "HTML5", "SCSS", "CSS3", "EmailJS"],
    description:
      "Built a dynamic and responsive website using ReactJS, leveraging reusable components for efficient development. Integrated a contact form using EmailJS for direct email communication.",
    link: "https://aonix-website.netlify.app/",
    imageUrl: "/portfolio/aonix-v2.jpg",
  },
  {
    id: 2,
    title: "Dataviv Technologies",
    technologies: ["HTML5", "Bootstrap", "JavaScript", "jQuery", "SCSS"],
    description:
      "This website is my own creation for a company, and I must say it turned out to be a visually appealing and impressive website. The animation used in the layout is absolutely fabulous, and I take great pride in designing the color combination and implementing the animations throughout the website.",
    link: "https://dataviv-technologies.web.app/",
    imageUrl: "/portfolio/dataviv.jpg",
  },
  {
    id: 3,
    title: "Tradebattle",
    technologies: ["React", "JavaScript", "HTML5", "SCSS", "CSS3", "GSAP"],
    description:
      "Tradebattle is an interactive platform where users can place bets on stock market trends. Built using React, this project integrates dynamic features like scroll-driven animations and a sleek, responsive design. GSAP was used extensively to create smooth animations that enhance the user experience.",
    link: "https://tradebattle.win/",
    imageUrl: "/portfolio/tradebattle.jpg",
  },
  {
    id: 4,
    title: "Data Web",
    technologies: ["HTML5", "JavaScript", "jQuery", "SCSS"],
    description:
      "I came across this website long after my course, and I decided to replicate it exactly as it is seen. I added a few of my own modifications, such as a sticky navigation and some hover animations.",
    link: "https://developerr-ayush.github.io/dataweb/",
    imageUrl: "/portfolio/dataweb.jpg",
  },
  {
    id: 5,
    title: "Netflix Landing Page",
    technologies: ["React", "JavaScript", "HTML5", "SCSS", "CSS3"],
    description:
      "I created a Netflix landing page clone using React. Most of my focus went into the section where videos play. While keeping the design simple, I also addressed some flaws present in the actual Netflix website within this clone.",
    link: "https://ayush-web-notflix.netlify.app/",
    imageUrl: "/portfolio/netflix.jpg",
  },
  {
    id: 6,
    title: "School VR",
    technologies: ["React", "JavaScript", "HTML5", "SCSS", "CSS3"],
    description:
      "I built a website using React, and the toughest part was designing it and making dynamic pages. After that, I integrated EmailJs into it. Additionally, I added some small animations throughout the website.",
    link: "https://schoolvr.netlify.app/",
    imageUrl: "/portfolio/schoolvr.jpg",
  },
];

export const services = [
  {
    id: 1,
    title: "Website Creation",
    description:
      "Crafting visually appealing and functional websites from scratch that align with your vision and goals. Our team of skilled front-end developers ensures a seamless user experience.",
  },
  {
    id: 2,
    title: "Optimization",
    description:
      "Boosting the performance of existing websites through strategic optimization. From enhancing loading speeds to refining user interfaces, I improve search engine rankings and user satisfaction.",
  },
  {
    id: 3,
    title: "Component-Based Approach",
    description:
      "Implementing a component-based approach in web development for modular and efficient design. This ensures scalability, maintainability, and reusability of code components across the website.",
  },
  {
    id: 4,
    title: "Color Theming with Variables",
    description:
      "Utilizing variables throughout the website for color theming. This allows for easy customization and consistency in maintaining the visual aesthetics of your brand or project.",
  },
  {
    id: 5,
    title: "Dark Mode Options",
    description:
      "Providing users with the option to switch to dark mode for a comfortable and visually pleasing experience, especially in low-light environments. Enhancing accessibility and user preference.",
  },
  {
    id: 6,
    title: "Responsive Designs",
    description:
      "Creating websites with responsive designs that seamlessly adapt to various devices. Ensuring a consistent and optimal user experience, whether accessed on a desktop, tablet, or smartphone.",
  },
];

export const techStack = [
  { name: "HTML5", icon: FaHtml5, color: "#e34c26" },
  { name: "CSS3", icon: FaCss3, color: "#264de4" },
  { name: "JavaScript", icon: SiJavascript, color: "#f0db4f" },
  { name: "TypeScript", icon: SiTypescript, color: "#007acc" },
  { name: "React", icon: FaReact, color: "#61DBFB" },
  { name: "Next.js", icon: SiNextdotjs, color: "#000000" },
  { name: "Node.js", icon: FaNodeJs, color: "#3c873a" },
  { name: "Express", icon: SiExpress, color: "#000000" },
  { name: "MongoDB", icon: SiMongodb, color: "#4DB33D" },
  { name: "Sass", icon: FaSass, color: "#cc6699" },
  { name: "Tailwind CSS", icon: SiTailwindcss, color: "#38b2ac" },
  { name: "Git", icon: FaGitAlt, color: "#F1502F" },
];
