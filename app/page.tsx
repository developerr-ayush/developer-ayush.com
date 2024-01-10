import CardList from "./component/card/CardList";
import CardProfile from "./component/card/CardProfile";
import CardMarquee from "./component/card/CardMarquee";
import CardSign from "./component/card/CardSign";
import CardWork from "./component/card/CardWork";
import CardBlog from "./component/card/CardBlog";
import CardShare from "./component/card/CardShare";
import CardExp from "./component/card/CardExp";
import CardContact from "./component/card/CardContact";
import CardService from "./component/card/CardService";
export default function Home() {
  return (
    <CardList className="grid">
      <CardProfile />
      <CardMarquee />
      <CardSign />
      <CardWork />
      <CardService />
      <CardShare />
      <CardBlog />
      <CardExp />
      <CardContact />
    </CardList>
  )
}
