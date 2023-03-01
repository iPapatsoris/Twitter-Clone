import Button from "../util/components/Button/Button";
import Dropdown from "../util/components/Dropdown/Dropdown";
import Input from "../util/components/Input/Input";
import styles from "./Signup.module.scss";
import {
  getDaysInMonth,
  getMonths,
  getYears,
  isInvalidDate,
} from "../util/date";
import { useState } from "react";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import dayjs from "dayjs";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

interface SignupProps {}

type Option = React.ComponentProps<typeof Dropdown>["options"][0];

const Signup = ({}: SignupProps) => {
  const [month, setMonth] = useState(-1);
  const [day, setDay] = useState(-1);
  const [year, setYear] = useState(-1);

  const months: Option[] = getMonths().map((m) => ({
    id: m.id,
    component: <span>{m.text}</span>,
    onSelect: () => {
      console.log("clicked on a month");

      setMonth(m.id);
      if (isInvalidDate({ day, year, month: m.id })) {
        setDay(-1);
      }
    },
  }));

  const days: Option[] = getDaysInMonth({ month, year }).map((d) => ({
    id: d.id,
    component: <span>{d.text}</span>,
    onSelect: () => {
      setDay(d.id);
    },
  }));

  const years: Option[] = getYears().map((y) => ({
    id: y.id,
    component: <span>{y.text}</span>,
    onSelect: () => {
      setYear(y.id);
      if (isInvalidDate({ day, year: y.id, month })) {
        setDay(-1);
      }
    },
  }));

  type FormInput = {
    name: string;
    email: string;
    birthDate: dayjs.Dayjs;
  };

  const maxNameChars = 50;
  const schema = yup.object().shape({
    name: yup.string().required("What's your name?").max(maxNameChars),
    email: yup
      .string()
      .required("Please enter your email.")
      .email("Please enter a valid email."),
  });

  const form = useForm<FormInput>({
    defaultValues: {
      name: "",
      email: "",
    },
    mode: "onTouched",
    resolver: yupResolver(schema),
  });

  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = form;
  const onSubmit: SubmitHandler<FormInput> = (data) => {
    console.log(data);
  };
  console.log(errors);

  const isValidForm = isValid && day !== -1 && month !== -1 && year !== -1;

  return (
    <form
      className={styles.Signup}
      onSubmit={(e) => {
        console.log(form.formState.touchedFields);
        handleSubmit(onSubmit);
        e.preventDefault();
      }}
    >
      <h1>Create your account</h1>
      <div className={styles.Form}>
        <div className={styles.NameEmail}>
          <Controller
            name="name"
            control={control}
            render={({
              field: { onChange, onBlur, value, name, ref },
              fieldState: { invalid, isTouched, isDirty, error },
              formState,
            }) => {
              return (
                <Input
                  name={name}
                  placeholder="Name"
                  maxLength={50}
                  autofocus
                  onBlur={onBlur}
                  onChange={onChange}
                  value={value}
                  ref={ref}
                  error={error?.message}
                />
              );
            }}
          ></Controller>
          <Controller
            name="email"
            control={control}
            render={({
              field: { onChange, onBlur, value, name, ref },
              fieldState: { invalid, isTouched, isDirty, error },
              formState,
            }) => {
              return (
                <Input
                  name={name}
                  placeholder="Email"
                  onBlur={onBlur}
                  onChange={onChange}
                  value={value}
                  ref={ref}
                  error={error?.message}
                />
              );
            }}
          ></Controller>
        </div>
        <div>
          <h4>Date of birth</h4>
          <div className={styles.DateOfBirth}>
            This will not be shown publicly. Confirm your own age, even if this
            account is for a business, a pet, or something else.
          </div>
          <div className={styles.Dropdowns}>
            <Dropdown
              name="Month"
              options={months}
              selectedOptionID={month !== -1 ? month : null}
              extraStyles={[styles.Dropdown]}
              position={{ block: "bottom", inline: "leftCover" }}
            />
            <Dropdown
              name="Day"
              options={days}
              selectedOptionID={day !== -1 ? day : null}
              extraStyles={[styles.Dropdown]}
              position={{ block: "top", inline: "leftCover" }}
            />
            <Dropdown
              name="Year"
              options={years}
              selectedOptionID={year !== -1 ? year : null}
              extraStyles={[styles.Dropdown]}
              position={{ block: "top", inline: "leftCover" }}
            />
          </div>
        </div>
      </div>
      <Button
        type="submit"
        size="large"
        largeFont
        extraClasses={[styles.Button]}
        color="black"
        disabled={!isValidForm}
      >
        Next
      </Button>
    </form>
  );
};

export default Signup;
