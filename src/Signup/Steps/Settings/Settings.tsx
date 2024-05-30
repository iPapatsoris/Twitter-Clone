import React, { SetStateAction } from "react";
import Setting from "./Setting";
import styles from "./Settings.module.scss";
import useStepper from "../../../util/hooks/useStepper";
import Terms from "../../Terms/Terms";
import NextStepButton from "../NextStepButton";
import { MinipageProps } from "../../../util/layouts/Minipage/Minipage";
import Form from "../../../util/components/Form/Form";
import { SettingsT } from "../../useSignupState";
import { SubmitHandler, useForm } from "react-hook-form";

interface SettingsProps {
  settings: SettingsT;
  setSettings: React.Dispatch<SetStateAction<SettingsT>>;
  stepper: ReturnType<typeof useStepper>;
  minipage?: React.ReactElement<MinipageProps>;
}

const Settings = ({
  settings: { receiveEmails, beFoundByEmail, personalizeAds },
  setSettings,
  stepper: { nextStep },
  minipage,
}: SettingsProps) => {
  const form = useForm<SettingsT>({
    defaultValues: {
      receiveEmails,
      beFoundByEmail,
      personalizeAds,
    },
  });

  const { handleSubmit, control } = form;

  const onSubmit: SubmitHandler<SettingsT> = (settings) => {
    setSettings(settings);
    nextStep();
  };

  const settingsList: Array<Omit<React.ComponentProps<typeof Setting>, "id">> =
    [
      {
        title: "Get more out of Twitter",
        label: "Receive email about your Twitter activity and recommendations.",
        checked: receiveEmails,
        name: "receiveEmails",
        control,
      },
      {
        title: "Connect with people you know",
        label: "Let others find your Twitter account by your email address.",
        checked: beFoundByEmail,
        name: "beFoundByEmail",
        control,
      },
      {
        title: "Personalized ads",
        label:
          "You will always see ads on Twitter based on your Twitter activity. When this setting is enabled, Twitter may further personalize ads from Twitter advertisers, on and off Twitter, by combining your Twitter activity with other online activity and information from our partners.",
        checked: personalizeAds,
        name: "personalizeAds",
        control,
      },
    ];

  const settingsListJSX = settingsList.map((props, index) => (
    <Setting {...props} id={index.toString()} key={index} />
  ));

  if (!minipage) {
    return null;
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      {React.cloneElement(minipage, {
        footer: <NextStepButton isDisabled={false} />,
        children: (
          <div className={styles.Settings}>
            <h1>Customize your experience</h1>
            <div className={styles.SettingsList}>{settingsListJSX}</div>
            <Terms />
          </div>
        ),
      })}
    </Form>
  );
};

export default Settings;
