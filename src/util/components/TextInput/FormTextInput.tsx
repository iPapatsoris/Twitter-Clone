import {
  FieldValues,
  Path,
  useController,
  UseFormReturn,
} from "react-hook-form";
import Input from "./TextInput";
import React, { useEffect, useState } from "react";
import TextInput from "./TextInput";

type FormInputProps<FormInput extends FieldValues> = Omit<
  React.ComponentProps<typeof Input>,
  "onChange" | "onBlur" | "value" | "error"
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
const FormInput = <FormInput extends FieldValues>({
  name,
  control,
  placeholder,
  maxLength,
  autofocus,
  type,
}: FormInputProps<FormInput>) => {
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { isDirty, error },
  } = useController({ name, control });
  const [hasBeenDirtied, setHasBeenDirtied] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    if (isDirty && !hasBeenDirtied) {
      setHasBeenDirtied(true);
    }
  }, [isDirty, hasBeenDirtied, setHasBeenDirtied]);

  const handleBlur = () => {
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
      ref={ref}
      error={showErrors && error ? error.message : ""}
      type={type}
    />
  );
};

export default FormInput;
