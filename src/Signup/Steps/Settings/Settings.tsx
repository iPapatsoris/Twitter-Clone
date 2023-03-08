import { SetStateAction, useEffect } from "react";
import { SettingsT } from "../../Signup";
import Setting from "./Setting";
import styles from "./Settings.module.scss";
import { Link } from "react-router-dom";
import paths from "../../../util/paths";
import { StepperProps } from "../../../util/components/Stepper/Stepper";

interface SettingsProps extends StepperProps {
  nextStep: VoidFunction;
  settings: SettingsT;
  setSettings: React.Dispatch<SetStateAction<SettingsT>>;
}

const Settings = ({
  settings: { receiveEmails, beFoundByEmail, personalizeAds },
  setSettings,
  stepper,
}: SettingsProps) => {
  useEffect(() => {
    stepper.setIsNextStepDisabled(false);
  }, [stepper]);

  useEffect(() => {
    stepper.nextStepButtonRef.current?.addEventListener(
      "click",
      stepper.nextStep
    );
    return () =>
      stepper.nextStepButtonRef.current?.removeEventListener(
        "click",
        stepper.nextStep
      );
  }, [stepper]);

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
      {/* <SignupFooter isDisabled={false} onClick={nextStep} /> */}
    </div>
  );
};

export default Settings;
