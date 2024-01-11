import Title from "../component/Title";
import Card from "../component/card/Card";
import CardAbout from "../component/card/CardAbout";
import CardBlog from "../component/card/CardBlog";
import CardEdu from "../component/card/CardEdu";
import CardExperience from "../component/card/CardExperience";
import CardImg from "../component/card/CardImg";
import CardList from "../component/card/CardList";
import CardShare from "../component/card/CardShare";
import CardSign from "../component/card/CardSign";

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
                <CardBlog />
                <CardShare />
                <CardSign />
            </CardList>

        </>
    )
}