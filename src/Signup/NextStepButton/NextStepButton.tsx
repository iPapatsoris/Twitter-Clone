import { ForwardedRef, forwardRef } from "react";
import Button from "../../util/components/Button/Button";
import styles from "./NextStepButton.module.scss";

interface FooterProps {
  isDisabled: boolean;
}
const NextStepButton = forwardRef(
  ({ isDisabled }: FooterProps, ref: ForwardedRef<HTMLButtonElement>) => {
    return (
      <div className={styles.Footer}>
        <Button
          type="submit"
          size="large"
          largeFont
          color="black"
          stretch
          disabled={isDisabled}
          ref={ref}
          extraClasses={[styles.Button]}
        >
          Next
        </Button>
      </div>
    );
  }
);

export default NextStepButton;
