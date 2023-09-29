// import "./Explore.scss";

import Trends from "../../components/Trends/Trends";
import List from "../../layouts/ContentRight/List/List";

const Explore = () => {
  return (
    <List title="Trends for you" withExpand>
      <Trends />
    </List>
  );
};

export default Explore;
