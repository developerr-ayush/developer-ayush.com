import React from 'react'
import CardList from '../component/card/CardList'
import BasicCard from '../component/card/BasicCard'
import profile from "@/assets/img/profile.jpg"
import Social from '../component/Social'
import Button from '../component/Button'
import Title from '../component/Title'
let exp = [


    {
        id: 3,
        from: "Sportz Interactive",
        position: "Junior Front End Developer",
        date: "November 2022 - Present",
        para: "Now, at Sportz Interactive, I'm still a Front End Developer. I use a tool called SCSS to make websites look nice. I've taken sessions on coding practices and optimizing our code to improve our skills. Additionally, I've contributed to various internal Sportz projects, bringing my expertise to the team and ensuring our work meets high standards.",
    },
    {
        id: 2,
        from: "DataViv Technologies",
        position: "Junior Front End Developer",
        date: "November 2021 - October 2022",
        para: "I continued as a Front End Developer at Dataviv for almost a year. I focused on making websites that work well on all devices and fixing any problems. I also worked closely with other developers on 20+ projects, where I learned a lot. I created cool features for over 20 websites using Bootstrap, 10+ with SCSS, and another 10+ with HTML and CSS.",
    },
    {
        id: 1,
        from: "DataViv Technologies",
        position: "Front End Developer Intern",
        date: "July 2021 - October 2021",
        para: "I completed a 3-month internship at Dataviv Technologies as a Front End Developer. My job was to create websites using bootstraps and custom code, making sure they look good on different devices. I fixed any issues that popped up and worked on more than 10 projects. It was a great learning experience.",
    },
];
let edu = [
    {
        id: 6,
        from: "Apna College",
        position: "Full Stack + DSA (Sigma Batch)",
        date: "June 2023 - December 2023",
        para: "Currently enrolled in the SIGMA batch at Apna College, where I am focusing on Data Structures and Algorithms (DSA). The program also includes web development, which seems somewhat familiar to what I've learned previously. However, I am confident in my ability to grasp DSA concepts, and I am particularly excited about working with Java in this context. Looking forward to enhancing my skills in these areas.",
    },


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
        date: "May 2021",
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
interface dataObj {
    id: number,
    from: string,
    position: string,
    date: string,
    para: string,
}
const page = () => {
    return (
        <>
            <CardList className="grid grid-lg-3 align-start">
                <div className="col-lg-1 card-md-sticky">
                    {/* Profile Card */}
                    <BasicCard img={{
                        src: profile,
                        alt: "Ayush Shah"
                    }} className="card-about-profile" content={{ name: "Ayush Shah", text: "@developerr_ayush" }}>
                        <div className="card-social-wrap">
                            <Social />
                        </div>
                        <Button>Contact Me</Button>
                    </BasicCard>
                </div>
                <div className="col-lg-2">
                    <CardList className='mb-0'>
                        <Title>About Me</Title>
                        <p className="text">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Perferendis dignissimos, animi dolorum enim eligendi vitae eaque temporibus officia nihil neque illum fugit. Nostrum corrupti accusamus dolore atque ipsum dignissimos fugit et doloremque praesentium officia rerum in quasi cum voluptatum, minima quam possimus est ea iusto illo. Repudiandae ducimus nihil reiciendis.</p>
                        <p className="text">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Perferendis dignissimos, animi dolorum enim eligendi vitae eaque temporibus officia nihil neque illum fugit. Nostrum corrupti accusamus dolore atque ipsum dignissimos fugit et doloremque praesentium officia rerum in quasi cum voluptatum, minima quam possimus est ea iusto illo. Repudiandae ducimus nihil reiciendis.</p>
                        <Title>Experience</Title>
                        {exp.map((e: dataObj) => {
                            return <BasicCard key={e.id} className="card-experience" content={{ title: e.position, name: e.from, subTitle: e.date, text: e.para }}>
                            </BasicCard>
                        })}
                        <Title>Education</Title>
                        {edu.map((e: dataObj) => {
                            return <BasicCard key={e.id} className="card-experience" content={{ title: e.position, name: e.from, subTitle: e.date, text: e.para }}>
                            </BasicCard>
                        })}
                    </CardList>

                </div>
            </CardList>
        </>
    )
}

export default page