import Image from "next/image";
import Card from "./component/Card";
import profile from "@/assets/img/profile.jpg"
import sign from "@/assets/img/signature.png"
import myWork from "@/assets/img/my-works.png"
import blog from "@/assets/img/gfonts.png"
import RedirectAnchor from "./component/RedirectAnchor";
import Marquee from "./component/Marquee";
import CardList from "./component/CardList";
export default function Home() {
  return (
    <CardList>
      <Card className="card-profile">
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
      <Card className="card-marquee">
        <Marquee />
      </Card>
      <Card className="card-sign">
        <div className="card-image">
          <Image src={sign} width={240} alt="creds" />
        </div>
        <div className="card-content">
          <p className="card-sub-title">more about me</p>
          <h3 className="card-title">Credentials</h3>
        </div>
        <RedirectAnchor href="/" />
      </Card>
      <Card className="card-work">
        <div className="card-image">
          <Image src={myWork} width={240} alt="mywork" />
        </div>
        <div className="card-content">
          <p className="card-sub-title">Showcase</p>
          <h3 className="card-title">Projects</h3>
        </div>
        <RedirectAnchor href="/" />
      </Card>
      <Card className="card-blog">
        <div className="card-image">
          <Image src={blog} width={240} alt="mywork" />
        </div>
        <div className="card-content">
          <p className="card-sub-title"> Blog</p>
          <h3 className="card-title">GFonts</h3>
        </div>
        <RedirectAnchor href="/" />
      </Card>
      <Card className="card-service">
        <div className="card-icons">
            
        </div>
        <div className="card-content">
          <p className="card-sub-title">Specilization</p>
          <h3 className="card-title">Service Offering</h3>
        </div>
        <RedirectAnchor href="/" />
      </Card>
    </CardList>
  )
}
