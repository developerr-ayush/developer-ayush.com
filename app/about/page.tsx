import Title from "../component/Title";
import BasicCard from "../component/card/BasicCard";
import CardEdu from "../component/card/CardEdu";
import CardExperience from "../component/card/CardExperience";
import CardList from "../component/card/CardList";
import CardShare from "../component/card/CardShare";
import sign from "@/assets/img/signature.png"
import blog from "@/assets/img/gfonts.png"
import profile from "@/assets/img/profile.jpg"

export default function About() {
    return (
        <>
            <CardList className="grid grid-lg-3 align-end">
                <div className="col-lg-1 row-lg-2">

                    <BasicCard img={{
                        src: profile,
                        alt: "Ayush Shah"
                    }} className="card-about-profile" />
                </div>
                <div className="col-lg-2">
                    <Title>Self Summary</Title>

                </div>
                <div className="col-lg-2">
                    <BasicCard content={{
                        name: "Ayush Shah",
                        text: "Hello There! I am Ayush Shah from Mumbai, and I love coding websites.I ensure that the entire website is responsive and displays well across different devices.I believe this is just the beginning, and there are many more exciting things to explore in the world of web development."
                    }} />
                </div>
            </CardList>
            <CardList className="grid grid-lg-2 card-knowledge">
                <CardExperience />
                <CardEdu />
            </CardList>

            <CardList className="grid grid-lg-4 card-knowledge">
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

                    <CardShare />
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