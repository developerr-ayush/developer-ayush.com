import Title from "../component/Title";
import BasicCard from "../component/card/BasicCard";
import CardList from "../component/card/CardList";
import sign from "@/assets/img/signature.png"
import blog from "@/assets/img/gfonts.png"
import profile from "@/assets/img/profile.jpg"
import Card from "../component/card/Card";
import Social from "../component/Social";
import Cardknowledege from "../component/card/Cardknowledege";
import { edu, exp } from "../data/data";
import Button from "../component/Button";

export default function About() {
    return (
        <>
            <CardList className="grid grid-lg-3 align-start">
                <div className="col-lg-1 row-lg-2 card-md-sticky">
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
                    <Title>Self <span className="highlight">Summary</span></Title>
                </div>
                <div className="col-lg-2">
                    <CardList className="mb-0">

                        <BasicCard content={{
                            name: "Ayush Shah",
                            text: "Hello There! I am Ayush Shah from Mumbai, and I love coding websites.I ensure that the entire website is responsive and displays well across different devices.I believe this is just the beginning, and there are many more exciting things to explore in the world of web development."
                        }} />
                        <Cardknowledege title="Experience" data={exp} />
                        <Cardknowledege title="Education" data={edu} />
                    </CardList>
                </div>
            </CardList>

            <CardList className="grid grid-lg-4 ">
                <div className="col-lg-1">

                    <BasicCard img={{
                        src: blog,
                        alt: "Blog"
                    }}
                        content={{
                            title: "GFonts",
                            subTitle: "Blog"
                        }}
                        redirect="/blog"
                        className="card-blog" />
                </div>

                <div className="col-lg-2">

                    <BasicCard content={{
                        title: "Profile",
                        subTitle: "Stay With me"
                    }} redirect="/contact">
                        <Card className="card-social">
                            <Social />
                        </Card>
                    </BasicCard>
                </div>
                <div className="col-lg-1">

                    <BasicCard img={{
                        src: sign,
                        alt: "Signature"
                    }}
                        content={{
                            title: "Credentials",
                            subTitle: "More about me"
                        }}
                        redirect="/credentials"
                        className="card-sign" /> </div>

            </CardList>

        </>
    )
}