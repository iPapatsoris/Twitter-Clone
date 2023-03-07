import { Controller, FieldValues, Path, UseFormReturn } from "react-hook-form";
import Input from "./TextInput";
import React from "react";
import TextInput from "./TextInput";

type FormInputProps<FormInput extends FieldValues> = Omit<
  React.ComponentProps<typeof Input>,
  "onChange" | "onBlur" | "value" | "error"
> & {
  control: UseFormReturn<FormInput, any>["control"];
  name: Path<FormInput>;
} & Pick<React.ComponentProps<typeof TextInput>, "type">;

const FormInput = <FormInput extends FieldValues>({
  name,
  control,
  placeholder,
  maxLength,
  autofocus,
  type,
}: FormInputProps<FormInput>) => (
  <Controller
    name={name}
    control={control}
    render={({
      field: { onChange, onBlur, value, name, ref },
      fieldState: { invalid, isTouched, isDirty, error },
      formState,
    }) => {
      return (
        <Input
          name={name}
          placeholder={placeholder}
          maxLength={maxLength !== undefined ? maxLength : undefined}
          autofocus={autofocus !== undefined ? autofocus : undefined}
          onBlur={onBlur}
          onChange={onChange}
          value={value}
          ref={ref}
          error={error?.message}
          type={type}
        />
      );
    }}
  ></Controller>
);

export default FormInput;
