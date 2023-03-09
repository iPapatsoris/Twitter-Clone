import TextInput from "../../../util/components/TextInput/TextInput";
import useStepper from "../../../util/hooks/useStepper";
import { AccountInfoT } from "../../Signup";
import styles from "./VerifyAccountInfo.module.scss";
import verifiedIcon from "../../../assets/icons/verified.png";
import Terms from "../../Terms/Terms";
import StepHeader from "../StepHeader";
import Button from "../../../util/components/Button/Button";
import Minipage from "../../../util/layouts/Minipage/Minipage";

interface VerifyAccountInfoProps {
  accountInfo: AccountInfoT;
  stepper: ReturnType<typeof useStepper>;
  header?: string;
}

const VerifyAccountInfo = ({
  header = "",
  accountInfo,
  stepper: { step, setStep, nextStep, prevStep },
}: VerifyAccountInfoProps) => {
  return (
    <Minipage
      header={
        <StepHeader step={step} onPrevStepClick={prevStep}>
          {header}
        </StepHeader>
      }
      footer={
        <>
          <Terms extraStyles={[styles.Terms]} />
          <Button
            size="large"
            largeFont
            color="primary"
            stretch
            onClick={nextStep}
          >
            Sign up
          </Button>
        </>
      }
    >
      <div className={styles.VerifyAccountInfo}>
        <TextInput
          name="name"
          placeholder="Name"
          readonly
          icon={verifiedIcon}
          value={accountInfo.name}
          onClick={() => setStep(0)}
          onChange={() => {}}
        />
        <TextInput
          name="email"
          placeholder="Email"
          readonly
          icon={verifiedIcon}
          value={accountInfo.email}
          onClick={() => setStep(0)}
          onChange={() => {}}
        />
        <TextInput
          name="birthDate"
          placeholder="Date of birth"
          readonly
          icon={verifiedIcon}
          value={accountInfo.birthDate!.format("MMM M, YYYY")}
          onClick={() => setStep(0)}
          onChange={() => {}}
        />
      </div>
    </Minipage>
  );
};

export default VerifyAccountInfo;
