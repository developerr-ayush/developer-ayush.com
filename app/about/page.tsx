import Title from "../component/Title";
import Card from "../component/card/Card";
import CardAbout from "../component/card/CardAbout";
import CardEdu from "../component/card/CardEdu";
import CardExperience from "../component/card/CardExperience";
import CardImg from "../component/card/CardImg";
import CardList from "../component/card/CardList";

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
        </>
    )
}