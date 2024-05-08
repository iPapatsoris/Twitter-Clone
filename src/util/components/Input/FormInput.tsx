import {
  FieldValues,
  Path,
  useController,
  UseFormReturn,
} from "react-hook-form";
import Input, { RefType } from "./Input";
import React, {
  ComponentProps,
  MutableRefObject,
  ReactElement,
  Ref,
  useEffect,
  useState,
} from "react";

type FormInputProps<FormInput extends FieldValues> = Omit<
  React.ComponentProps<typeof Input>,
  "isValid" | "value" | "error"
> & {
  control: UseFormReturn<FormInput, any>["control"];
  name: Path<FormInput>;
};

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
    onBlur: onBlurSideEffect,
    onChange: onChangeSideEffect,
  } = props;
  const {
    field: {
      onChange: onChangeFormController,
      onBlur: onBlurFormController,
      value,
      ref: register,
    },
    fieldState: { isDirty, error, invalid },
  } = useController({ name, control });

  const [hasBeenDirtied, setHasBeenDirtied] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    if (isDirty && !hasBeenDirtied) {
      setHasBeenDirtied(true);
    }
  }, [isDirty, hasBeenDirtied, setHasBeenDirtied]);

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onBlurSideEffect && onBlurSideEffect(e);
    onBlurFormController();
    if (hasBeenDirtied) {
      setShowErrors(true);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onChangeSideEffect && onChangeSideEffect(e);
    onChangeFormController(e);
  };

  const handleRef: ComponentProps<typeof Input>["ref"] = (r) => {
    // Register inner <Input> ref to form
    register(r);
    if (ref && r) {
      // Assign inner <Input> ref to <FormInput> forwarded ref
      (ref as MutableRefObject<RefType>).current = r;
    }
  };

  return (
    <Input
      {...props}
      value={value}
      onBlur={handleBlur}
      onChange={handleChange}
      ref={handleRef}
      isValid={hasBeenDirtied && !invalid}
      error={showErrors && error ? error.message : ""}
    />
  );
};

// Workaround to have TS for a component that uses forwardRef and a generic type
// at the same time
const FormInput = React.forwardRef(ActualComponent) as <
  FormInput extends FieldValues,
>(
  props: FormInputProps<FormInput> & { ref?: Ref<HTMLInputElement> }
) => ReactElement;

export default FormInput;
