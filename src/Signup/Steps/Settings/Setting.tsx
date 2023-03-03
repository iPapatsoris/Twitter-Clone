import { SetStateAction } from "react";
import Checkbox from "../../../util/components/Checkbox/Checkbox";

interface SettingProps {
  title: string;
  text: string;
  value: boolean;
  onChange: React.Dispatch<SetStateAction<boolean>>;
  id: number;
}

const Setting = ({ value, onChange, title, text, id }: SettingProps) => {
  return (
    <>
      <h2>{title}</h2>
      <Checkbox label={text} id={id} isChecked={value} onChange={onChange} />
    </>
  );
};

export default Setting;
