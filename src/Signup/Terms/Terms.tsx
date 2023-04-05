import { Link } from "react-router-dom";
import { getPagePath } from "../../util/paths";
import styles from "./Terms.module.scss";

interface TermsProps {
  length?: "full" | "short";
  extraStyles?: string[];
}

const Terms = ({ length = "full", extraStyles = [] }: TermsProps) => (
  <div className={[styles.Terms, ...extraStyles].join(" ")}>
    By signing up, you agree to the{" "}
    <Link to={getPagePath("tos")}> Terms of Service </Link>and{" "}
    <Link to={getPagePath("privacy")}>Privacy Policy,</Link> including{" "}
    <Link to={getPagePath("cookies")}>Cookie Use.</Link>
    {length === "full" ? (
      <>
        Twitter may use your contact information, including your email address
        and phone number for purposes outlined in our Privacy Policy.{" "}
        <Link to={getPagePath("privacy")}>Learn more</Link>
      </>
    ) : null}
  </div>
);

export default Terms;
