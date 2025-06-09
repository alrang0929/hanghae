import { ScrollDownBar } from "../../components/ScrollDownBar";
import { LIST_ITEMS } from "../../data/menu";
import TitleSvg from "../../assets/images/title.svg?react";
import "./mainPage.scss";
export const Main = () => {
  const TITLE = {
    src: "src/assets/images/title.svg",
    alt: "title: hanghea",
  };

  const BG_VIDEO = {
    src: "src/assets/233867_medium.mp4",
    alt: "background video: hanghae",
    type: "video/mp4",
  };

  return (
    <>
      <section className="index-wrap">
        <div className="contents-wrap">
          <div className="title image-box">
            <TitleSvg/>
          </div>
        </div>
        <video
          className="bg-video"
          width="100%"
          height="100%"
          autoPlay
          muted
          loop
        >
          <source src={BG_VIDEO.src} type={BG_VIDEO.type} />
          Your browser is not supported!
        </video>

        <div className="text-wrap flex-box">
          <ScrollDownBar />
          <ul className="flex-box column">
            {LIST_ITEMS.map((item) => (
              <li key={item.id} className={item.className}>
                {item.text}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
};
