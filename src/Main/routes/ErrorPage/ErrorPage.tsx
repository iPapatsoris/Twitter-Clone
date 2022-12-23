import Button from "../../../util/Button/Button";
import "./ErrorPage.scss";

const ErrorPage = () => {
  return (
    <div className="ErrorPage">
      <p>Hmm...this page doesn’t exist. Try searching for something else.</p>
      <Button style="medium">Search</Button>
    </div>
  );
};

export default ErrorPage;
