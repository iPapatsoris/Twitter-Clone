import Button from "../../util/components/Button/Button";

interface NextStepButtonProps {
  isDisabled: boolean;
  onClick: VoidFunction;
}

const NextStepButton = ({ isDisabled, onClick }: NextStepButtonProps) => (
  <Button
    type="submit"
    size="large"
    largeFont
    color="black"
    stretch
    disabled={isDisabled}
    onClick={onClick}
  >
    Next
  </Button>
);

export default NextStepButton;
