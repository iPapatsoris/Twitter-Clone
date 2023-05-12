import HoverPopup from "../util/components/Popup/HoverPopup/HoverPopup";
import Profile from "../Main/routes/Profile/Profile";
import "./Home.scss";

const Home = () => {
  return (
    <>
      <div className="Home">this is my Home</div>
      <HoverPopup
        popupProps={{ position: { block: "bottom", inline: "leftCover" } }}
        popupTarget={<Profile preview={{ username: "lel" }} />}
      >
        <span>Hover me!</span>
      </HoverPopup>
    </>
  );
};

export default Home;
