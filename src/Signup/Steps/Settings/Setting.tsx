import { Ref, forwardRef } from "react";
import FormCheckbox, {
  FormCheckboxProps,
} from "../../../util/components/Checkbox/FormCheckbox";
import { SettingsT } from "../../useSignupState";
import useForwardRef from "../../../util/hooks/useForwardRef";

const Setting = forwardRef(
  (props: FormCheckboxProps<SettingsT>, ref: Ref<HTMLInputElement>) => {
    const { title } = props;
    const fref = useForwardRef(ref);

    return (
      <>
        <h2>{title}</h2>
        <FormCheckbox {...props} ref={fref} />
      </>
    );
  }
);

export default Setting;
