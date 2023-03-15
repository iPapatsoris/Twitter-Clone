import Button from "../../util/components/Button/Button";

interface NextStepButtonProps {
  isDisabled: boolean;
  isLoading?: boolean;
  onClick?: VoidFunction;
}

const NextStepButton = ({
  isLoading = false,
  isDisabled,
  onClick,
}: NextStepButtonProps) => (
  <Button
    type="submit"
    size="large"
    largeFont
    color="black"
    stretch
    disabled={isDisabled}
    isLoading={isLoading}
    onClick={onClick}
  >
    Next
  </Button>
);

export default NextStepButton;
