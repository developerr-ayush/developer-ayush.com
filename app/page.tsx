import CardList from "./component/card/CardList";
import CardMarquee from "./component/card/CardMarquee";
import CardShare from "./component/card/CardShare";
import CardExp from "./component/card/CardExp";
import CardContact from "./component/card/CardContact";
import CardService from "./component/card/CardService";
import BasicCard from "./component/card/BasicCard";
import myWork from "@/assets/img/my-works.png"
import sign from "@/assets/img/signature.png"
import blog from "@/assets/img/gfonts.png"
import profile from "@/assets/img/profile.jpg"


export default function Home() {
  return (
    <CardList className="grid grid-4">
      <BasicCard img={{
        src: profile,
        alt: "Ayush Shah"
      }}
        content={{
          text: "i am a Web Developer based in Mumbai",
          subTitle: "Full Stack Web Developer",
          name: "Ayush Shah",
        }}
        className="card-profile"></BasicCard>
      <CardMarquee />
      <BasicCard img={{
        src: sign,
        alt: "Signature"
      }}
        content={{
          title: "Credentials",
          subTitle: "More about me"
        }}
        className="card-sign" />
      <BasicCard img={{
        src: myWork,
        alt: "MyWork"
      }}
        content={{
          title: "Projects",
          subTitle: "Showcase"
        }}
        className="card-work" />
      <CardService />
      <CardShare />
      <BasicCard img={{
        src: blog,
        alt: "Blog"
      }}
        content={{
          title: "GFonts",
          subTitle: "Blog"
        }}
        className="card-blog" />
      <CardExp />
      <CardContact />
    </CardList>
  )
}
