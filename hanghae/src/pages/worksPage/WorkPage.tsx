import "./works-page.scss";
import { WorksList } from "./WorksList";

export const WorkPage = () => {
  return (
    <section className="work-page-wrapper">
      <div className="title-wrap">
        <h2>
          <p>JIHYEON'S</p>
          <p>WORKS</p>
        </h2>
        <div className="counter">
          <p>(</p>
          <p>06</p>
          <p>)</p>
        </div>
      </div>
      <div className="works-list">
        <WorksList/>
      </div>
    </section>
  );
};
