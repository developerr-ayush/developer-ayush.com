import Image from "next/image";
import Card from "./Card";
import profile from "@/assets/img/profile.jpg"
import RedirectAnchor from "../RedirectAnchor";

const CardProfile = () => {
    return (
        <Card className="card-profile col-2 row-2">
            <div className="card-image">
                <Image src={profile} alt="profile" width={230} />
            </div>
            <div className="card-content">
                <p className="card-sub-title">A Web Developer</p>
                <h2 className="card-name">Ayush Shah</h2>
                <p className="card-text">i am a Web Developer based in Mumbai</p>
            </div>
            <RedirectAnchor href="/about" />
        </Card>
    )
}

export default CardProfile