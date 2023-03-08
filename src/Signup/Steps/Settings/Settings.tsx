import { SetStateAction } from "react";
import { SettingsT } from "../../Signup";
import Setting from "./Setting";
import styles from "./Settings.module.scss";
import { Link } from "react-router-dom";
import paths from "../../../util/paths";
import useStepper from "../../../util/hooks/useStepper";
import Step from "../../../util/components/Stepper/Step";

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
    <Step
      header={header}
      step={step}
      onNextStepClick={nextStep}
      onPrevStepClick={prevStep}
      isNextStepDisabled={false}
    >
      <div className={styles.Settings}>
        <h1>Customize your experience</h1>
        <div className={styles.SettingsList}>{settingsListJSX}</div>
        <div className={styles.Terms}>
          By signing up, you agree to the{" "}
          <Link to={paths.tos}> Terms of Service </Link>and{" "}
          <Link to={paths.privacy}>Privacy Policy,</Link> including{" "}
          <Link to={paths.cookies}>Cookie Use.</Link>
          Twitter may use your contact information, including your email address
          and phone number for purposes outlined in our Privacy Policy.{" "}
          <Link to={paths.privacy}>Learn more</Link>
        </div>
        <div className={styles.Terms}>
          By signing up, you agree to the{" "}
          <Link to={paths.tos}> Terms of Service </Link>and{" "}
          <Link to={paths.privacy}>Privacy Policy,</Link> including{" "}
          <Link to={paths.cookies}>Cookie Use.</Link>
          Twitter may use your contact information, including your email address
          and phone number for purposes outlined in our Privacy Policy.{" "}
          <Link to={paths.privacy}>Learn more</Link>
        </div>
        <div className={styles.Terms}>
          By signing up, you agree to the{" "}
          <Link to={paths.tos}> Terms of Service </Link>and{" "}
          <Link to={paths.privacy}>Privacy Policy,</Link> including{" "}
          <Link to={paths.cookies}>Cookie Use.</Link>
          Twitter may use your contact information, including your email address
          and phone number for purposes outlined in our Privacy Policy.{" "}
          <Link to={paths.privacy}>Learn more</Link>
        </div>
        <div className={styles.Terms}>
          By signing up, you agree to the{" "}
          <Link to={paths.tos}> Terms of Service </Link>and{" "}
          <Link to={paths.privacy}>Privacy Policy,</Link> including{" "}
          <Link to={paths.cookies}>Cookie Use.</Link>
          Twitter may use your contact information, including your email address
          and phone number for purposes outlined in our Privacy Policy.{" "}
          <Link to={paths.privacy}>Learn more</Link>
        </div>
        <div className={styles.Terms}>
          By signing up, you agree to the{" "}
          <Link to={paths.tos}> Terms of Service </Link>and{" "}
          <Link to={paths.privacy}>Privacy Policy,</Link> including{" "}
          <Link to={paths.cookies}>Cookie Use.</Link>
          Twitter may use your contact information, including your email address
          and phone number for purposes outlined in our Privacy Policy.{" "}
          <Link to={paths.privacy}>Learn more</Link>
        </div>
        <div className={styles.Terms}>
          By signing up, you agree to the{" "}
          <Link to={paths.tos}> Terms of Service </Link>and{" "}
          <Link to={paths.privacy}>Privacy Policy,</Link> including{" "}
          <Link to={paths.cookies}>Cookie Use.</Link>
          Twitter may use your contact information, including your email address
          and phone number for purposes outlined in our Privacy Policy.{" "}
          <Link to={paths.privacy}>Learn more</Link>
        </div>
        <div className={styles.Terms}>
          By signing up, you agree to the{" "}
          <Link to={paths.tos}> Terms of Service </Link>and{" "}
          <Link to={paths.privacy}>Privacy Policy,</Link> including{" "}
          <Link to={paths.cookies}>Cookie Use.</Link>
          Twitter may use your contact information, including your email address
          and phone number for purposes outlined in our Privacy Policy.{" "}
          <Link to={paths.privacy}>Learn more</Link>
        </div>
      </div>
    </Step>
  );
};

export default Settings;
