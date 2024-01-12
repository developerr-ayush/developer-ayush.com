import Title from "../component/Title";
import BasicCard from "../component/card/BasicCard";
import CardAbout from "../component/card/CardAbout";
import CardEdu from "../component/card/CardEdu";
import CardExperience from "../component/card/CardExperience";
import CardImg from "../component/card/CardImg";
import CardList from "../component/card/CardList";
import CardShare from "../component/card/CardShare";
import sign from "@/assets/img/signature.png"
import blog from "@/assets/img/gfonts.png"
export default function About() {
    return (
        <>
            <CardList className="grid grid-3">
                <CardImg />
                <Title />
                <CardAbout />
            </CardList>
            <CardList className="grid grid-2 card-knowledge">
                <CardExperience />
                <CardEdu />
            </CardList>

            <CardList className="grid grid-4 card-knowledge">
                <BasicCard img={{
                    src: blog,
                    alt: "Blog"
                }}
                    content={{
                        title: "GFonts",
                        subTitle: "Blog"
                    }}
                    className="card-blog" />
                <CardShare />
                <BasicCard img={{
                    src: sign,
                    alt: "Signature"
                }}
                    content={{
                        title: "Credentials",
                        subTitle: "More about me"
                    }}
                    className="card-sign" />
            </CardList>

        </>
    )
}