import CardList from "./component/card/CardList";
import CardShare from "./component/card/CardShare";
import CardExp from "./component/card/CardExp";
import CardContact from "./component/card/CardContact";
import CardService from "./component/card/CardService";
import BasicCard from "./component/card/BasicCard";
import myWork from "@/assets/img/my-works.png"
import sign from "@/assets/img/signature.png"
import blog from "@/assets/img/gfonts.png"
import profile from "@/assets/img/profile.jpg"
import Marquee from "./component/Marquee";


export default function Home() {
  return (
    <CardList className="grid grid-md-2 grid-lg-4">
      <div className="col-md-2  row-lg-2">

        <BasicCard img={{
          src: profile,
          alt: "Ayush Shah"
        }}
          content={{
            text: "i am a Web Developer based in Mumbai",
            subTitle: "Full Stack Web Developer",
            name: "Ayush Shah",
          }}
          className="card-profile" redirect="/about" />
      </div>
      <div className="col-md-2 col-lg-2">
        <BasicCard className="card-marquee" >
          <Marquee>
            <div className="marquee-item"><p>Latest Work and Feature</p></div>
            <div className="marquee-item"><p>Latest Work and Feature</p></div>
          </Marquee>
        </BasicCard>
      </div>
      <div className="col-md-1 col-lg-1">

        <BasicCard img={{
          src: sign,
          alt: "Signature"
        }}
          content={{
            title: "Credentials",
            subTitle: "More about me"
          }}
          redirect="/credentials"
          className="card-sign" />
      </div>
      <div className="col-md-1 col-lg-1">

        <BasicCard img={{
          src: myWork,
          alt: "MyWork"
        }}
          content={{
            title: "Projects",
            subTitle: "Showcase"
          }}
          redirect="/work"
          className="card-work" />
      </div>
      <div className="col-md-2 col-lg-2">

        <CardService />

      </div>
      <div className="col-md-2 col-lg-2">
        <CardExp />
      </div>
      <div className="col-md-2 col-lg-1">
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
      <div className="col-md-2 col-lg-2">
        <CardShare />
      </div>
      <div className="col-md-2 col-lg-1">
        <CardContact />
      </div>

    </CardList>
  )
}
