import { MoveObject } from "./functions/MoveObject";
import { ScrollDownBar } from "../../components/ScrollDownBar";
import { LIST_ITEMS } from "../../data/menu";
import TitleSvg from "../../assets/images/title.svg?react";
import "./mainPage.scss";
export const Main = () => {
  const BG_VIDEO = {
    src: "src/assets/233867_medium.mp4",
    alt: "background video: hanghae",
    type: "video/mp4",
  };

  return (
    <>
      <section className="main-page-wrapper">
        <MoveObject
          initialTopPercent={110}
          initialLeftPercent={85}
          scrollFactorTop={0.01}
          scrollFactorLeft={0.005}
        >
          <img src="src/assets/images/yacht.png" alt="요트 이미지" />
        </MoveObject>
        {/* <div className="move-objects">
        </div> */}
        <div className="contents-wrap">
          <div className="title image-box">
            <TitleSvg />
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

        <div className="text-contents-wrap">
          <ScrollDownBar />
          <ul className="text-contents-list">
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
