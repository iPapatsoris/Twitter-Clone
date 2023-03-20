import Button from "../../util/components/Button/Button";

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
    stretch
    disabled={isDisabled}
    isLoading={isLoading}
    onClick={onClick}
  >
    {children}
  </Button>
);

export default NextStepButton;
