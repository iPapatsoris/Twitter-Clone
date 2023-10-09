import Button from "../../util/components/Button/Button";
import styles from "./NextStepButton.module.scss";

interface NextStepButtonProps {
  isDisabled?: boolean;
  isLoading?: boolean;
  onClick?: VoidFunction;
  color?: React.ComponentProps<typeof Button>["color"];
  children?: string;
}

const NextStepButton = ({
  isLoading = false,
  isDisabled = false,
  onClick,
  color = "black",
  children = "Next",
}: NextStepButtonProps) => (
  <Button
    type="submit"
    size="large"
    largeFont
    color={color}
    disabled={isDisabled}
    isLoading={isLoading}
    onClick={onClick}
    extraClasses={[styles.Button]}
  >
    {children}
  </Button>
);

export default NextStepButton;
