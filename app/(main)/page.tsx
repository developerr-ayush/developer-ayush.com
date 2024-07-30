import CardList from "@/component/card/CardList";
import CardExp from "@/component/card/CardExp";
import CardContact from "@/component/card/CardContact";
import CardService from "@/component/card/CardService";
import BasicCard from "@/component/card/BasicCard";
import myWork from "@/assets/img/my-works.png"
import sign from "@/assets/img/signature.png"
import blog from "@/assets/img/gfonts.png"
import profile from "@/assets/img/home-proifile.png"
import Marquee from "@/component/Marquee";
import Social from "@/component/Social";
import Card from "@/component/card/Card";
import Clock from "@/component/Clock";
import { metadata } from "./layout";
import { MarqueeCard } from "@/component/card/MarqueeCard";


export default function Home() {
  metadata.title = "Ayush Shah"
  return (
    <CardList className="grid grid-md-2 grid-lg-4">
      {/* Profile */}
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
          className="card-profile" redirect="/about" ></BasicCard>
      </div>
      {/* marquee */}
      <div className="col-md-2 col-lg-2">
        <MarqueeCard />
      </div>
      {/* credentials */}
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
          className="card-sign" ></BasicCard>
      </div>
      {/* Work */}
      <div className="col-md-1 col-lg-1">

        <BasicCard
          content={{
            title: "Projects",
            subTitle: "Showcase"
          }}
          redirect="/work"
          className="card-work" >

          <Clock />

        </BasicCard>
      </div>
      {/* services */}
      <div className="col-md-2 col-lg-2">

        <CardService />

      </div>
      {/* Experience */}
      <div className="col-md-2 col-lg-2">
        <CardExp />
      </div>
      {/* blog */}
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
          className="card-blog" ></BasicCard>
      </div>
      {/* share */}
      <div className="col-md-2 col-lg-2">
        <BasicCard content={{
          title: "Profile",
          subTitle: "Stay With me"
        }} redirect="/contact">
          <Card className="card-social">
            <Social />
          </Card>
        </BasicCard>
      </div>
      {/* contact */}
      <div className="col-md-2 col-lg-1">
        <CardContact />
      </div>

    </CardList>
  )
}
