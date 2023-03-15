import { useRef, useState } from "react";
import OptionsPopup from "../../../util/components/OptionsPopup/OptionsPopup";
import styles from "./Helper.module.scss";

interface HelperProps {
  onResendCode: VoidFunction;
}

const Helper = ({ onResendCode }: HelperProps) => {
  const [isPopupActive, setIsPopupActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const options: React.ComponentProps<typeof OptionsPopup>["options"] = [
    {
      mainOption: {
        id: 0,
        component: <span>Resend code</span>,
        onSelect: onResendCode,
      },
    },
    {
      mainOption: {
        id: 1,
        component: <span>Use phone instead</span>,
        onSelect: () => {},
      },
    },
  ];

  return (
    <>
      <span
        ref={ref}
        className={styles.Helper}
        onClick={() => setIsPopupActive(true)}
      >
        Didn't receive email?
      </span>
      {isPopupActive && (
        <OptionsPopup
          options={options}
          targetAreaRef={ref}
          setIsActive={setIsPopupActive}
        />
      )}
    </>
  );
};

export default Helper;
