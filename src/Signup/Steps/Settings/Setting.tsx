import { ComponentProps, HTMLProps } from "react";
import Checkbox from "../../../util/components/Checkbox/Checkbox";

const Setting = (props: ComponentProps<typeof Checkbox>) => {
  const { title } = props;

  return (
    <>
      <h2>{title}</h2>
      <Checkbox {...props} />
    </>
  );
};

export default Setting;
