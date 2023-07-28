import {
  FieldValues,
  Path,
  useController,
  UseFormReturn,
} from "react-hook-form";
import Input, { RefType } from "./Input";
import React, {
  MutableRefObject,
  ReactElement,
  Ref,
  useEffect,
  useState,
} from "react";
import TextInput from "./Input";

type FormInputProps<FormInput extends FieldValues> = Omit<
  React.ComponentProps<typeof Input>,
  "onChange" | "value" | "error"
> & {
  control: UseFormReturn<FormInput, any>["control"];
  name: Path<FormInput>;
} & Pick<React.ComponentProps<typeof TextInput>, "type">;

/**
 * react-hook-form wrapper for custom controller Input component.
 * Extra logic to expand the library's "onBlur" mode prop for useForm:
 * the errors that would be reported on input blur, are reported only if the
 * input has been dirtied at least once before.
 */
const ActualComponent = <FormInput extends FieldValues>(
  props: FormInputProps<FormInput>,
  ref: Ref<HTMLInputElement>
) => {
  const {
    name,
    control,
    placeholder,
    maxLength,
    autofocus,
    type,
    leader,
    showStatusIcon,
    onBlur: onBlurUser = () => {},
  } = props;
  const {
    field: { onChange, onBlur, value, ref: register },
    fieldState: { isDirty, error, invalid },
  } = useController({ name, control });

  const [hasBeenDirtied, setHasBeenDirtied] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    if (isDirty && !hasBeenDirtied) {
      setHasBeenDirtied(true);
    }
  }, [isDirty, hasBeenDirtied, setHasBeenDirtied]);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    onBlurUser(e);
    onBlur();
    if (hasBeenDirtied) {
      setShowErrors(true);
    }
  };

  return (
    <Input
      name={name}
      placeholder={placeholder}
      maxLength={maxLength !== undefined ? maxLength : undefined}
      autofocus={autofocus !== undefined ? autofocus : undefined}
      onBlur={handleBlur}
      onChange={onChange}
      value={value}
      ref={(r) => {
        // Register input ref to form
        register(r);
        if (ref && r) {
          // Assign forwarded ref
          (ref as MutableRefObject<RefType>).current = r;
        }
      }}
      isValid={hasBeenDirtied && !invalid}
      error={showErrors && error ? error.message : ""}
      type={type}
      leader={leader}
      showStatusIcon={showStatusIcon}
    />
  );
};

// Workaround to have TS for a component that uses forwardRef and a generic type
// at the same time
const FormInput = React.forwardRef(ActualComponent) as <
  FormInput extends FieldValues
>(
  props: FormInputProps<FormInput> & { ref?: Ref<HTMLInputElement> }
) => ReactElement;

export default FormInput;
