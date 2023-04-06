import { useContext, useLayoutEffect } from "react";
import { ErrorPageContext } from "../../../App";
import style from "./ErrorPage.module.scss";

const ErrorPage = () => {
  const { setIsErrorPage } = useContext(ErrorPageContext);

  useLayoutEffect(() => {
    setIsErrorPage(true);

    return () => setIsErrorPage(false);
  }, [setIsErrorPage]);

  return (
    <div className={style.ErrorPage}>
      <p>Hmm...this page doesn’t exist. Try searching for something else.</p>
    </div>
  );
};

export default ErrorPage;
