import { SetStateAction } from "react";
import { SettingsT } from "../../Signup";
import Setting from "./Setting";
import styles from "./Settings.module.scss";
import signupStyles from "../../Signup.module.scss";
import useStepper from "../../../util/hooks/useStepper";
import Terms from "../../Terms/Terms";
import NextStepButton from "../NextStepButton";
import StepHeader from "../StepHeader";
import Minipage from "../../../util/layouts/Minipage/Minipage";
import Form from "../../../util/components/Form/Form";

interface SettingsProps {
  settings: SettingsT;
  setSettings: React.Dispatch<SetStateAction<SettingsT>>;
  stepper: ReturnType<typeof useStepper>;
  header?: string;
}

const Settings = ({
  settings: { receiveEmails, beFoundByEmail, personalizeAds },
  setSettings,
  stepper: { step, nextStep, prevStep },
  header = "",
}: SettingsProps) => {
  const settingsList: Array<
    Omit<React.ComponentProps<typeof Setting>, "id"> & {
      value: boolean;
    }
  > = [
    {
      title: "Get more out of Twitter",
      text: "Receive email about your Twitter activity and recommendations.",
      value: receiveEmails,
      onChange: () =>
        setSettings((s) => ({ ...s, receiveEmails: !s.receiveEmails })),
    },
    {
      title: "Connect with people you know",
      text: "Let others find your Twitter account by your email address.",
      value: beFoundByEmail,
      onChange: () =>
        setSettings((s) => ({ ...s, beFoundByEmail: !s.beFoundByEmail })),
    },
    {
      title: "Personalized ads",
      text: "You will always see ads on Twitter based on your Twitter activity. When this setting is enabled, Twitter may further personalize ads from Twitter advertisers, on and off Twitter, by combining your Twitter activity with other online activity and information from our partners.",
      value: personalizeAds,
      onChange: () =>
        setSettings((s) => ({ ...s, personalizeAds: !s.personalizeAds })),
    },
  ];

  const settingsListJSX = settingsList.map((props, index) => (
    <Setting {...props} id={index} key={index} />
  ));

  return (
    <Form onSubmit={nextStep}>
      <Minipage
        header={
          <StepHeader step={step} onPrevStepClick={prevStep}>
            {header}
          </StepHeader>
        }
        footer={<NextStepButton isDisabled={false} />}
        contentStyles={[signupStyles.Signup]}
      >
        <div className={styles.Settings}>
          <h1>Customize your experience</h1>
          <div className={styles.SettingsList}>{settingsListJSX}</div>
          <Terms />
        </div>
      </Minipage>
    </Form>
  );
};

export default Settings;
