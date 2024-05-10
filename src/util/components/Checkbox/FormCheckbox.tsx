import {
  FieldValues,
  Path,
  useController,
  UseFormReturn,
} from "react-hook-form";
import React, {
  ComponentProps,
  MutableRefObject,
  ReactElement,
  Ref,
} from "react";
import Checkbox from "./Checkbox";

export type FormCheckboxProps<T extends FieldValues> = Omit<
  React.ComponentProps<typeof Checkbox>,
  "value"
> & {
  control: UseFormReturn<T, any>["control"];
  name: Path<T>;
};

// react-hook-form wrapper for custom controller Checkbox component.
const ActualComponent = <T extends FieldValues>(
  props: FormCheckboxProps<T>,
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
  } = useController({ name, control });

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    onBlurSideEffect && onBlurSideEffect(e);
    onBlurFormController();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeSideEffect && onChangeSideEffect(e);
    onChangeFormController(e);
  };

  const handleRef: ComponentProps<typeof Checkbox>["ref"] = (r) => {
    // Register inner <Checkbox> ref to form
    register(r);
    if (ref && r) {
      // Assign inner <Checkbox> ref to <FormCheckbox> forwarded ref
      (ref as MutableRefObject<HTMLInputElement>).current = r;
    }
  };

  return (
    <Checkbox
      {...props}
      checked={value}
      onBlur={handleBlur}
      onChange={handleChange}
      ref={handleRef}
    />
  );
};

// Workaround to have TS for a component that uses forwardRef and a generic type
// at the same time
const FormCheckbox = React.forwardRef(ActualComponent) as <
  T extends FieldValues,
>(
  props: FormCheckboxProps<T> & {
    ref?: Ref<HTMLInputElement>;
  }
) => ReactElement;

export default FormCheckbox;
