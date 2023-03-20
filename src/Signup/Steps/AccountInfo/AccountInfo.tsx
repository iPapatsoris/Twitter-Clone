import Dropdown from "../../../util/components/Dropdown/Dropdown";
import styles from "./AccountInfo.module.scss";
import {
  getDaysInMonth,
  getMonths,
  getYears,
  isInvalidDate,
} from "../../../util/date";
import { SetStateAction, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import dayjs from "dayjs";
import { yupResolver } from "@hookform/resolvers/yup";
import FormInput from "../../../util/components/TextInput/FormTextInput";
import { AccountInfoT } from "../../Signup";
import useStepper from "../../../util/hooks/useStepper";
import NextStepButton from "../NextStepButton";
import StepHeader from "../StepHeader";
import Minipage from "../../../util/layouts/Minipage/Minipage";
import Form from "../../../util/components/Form/Form";
import { useQuery } from "react-query";
import { GetEmail } from "../../../../backend/src/api/email";
import { getData } from "../../../util/api";
import yup, { yupSequentialStringSchema } from "../../../util/yup";

interface AccountInfoProps {
  accountInfo: AccountInfoT;
  setAccountInfo: React.Dispatch<SetStateAction<AccountInfoT>>;
  stepper: ReturnType<typeof useStepper>;
  header?: string;
}

type Option = React.ComponentProps<typeof Dropdown>["options"][0];

const AccountInfo = ({
  stepper: { step, nextStep },
  accountInfo: { name, email, birthDate },
  setAccountInfo,
  header = "",
}: AccountInfoProps) => {
  const [month, setMonth] = useState(birthDate ? birthDate.month() : -1);
  const [day, setDay] = useState(birthDate ? birthDate.date() : -1);
  const [year, setYear] = useState(birthDate ? birthDate.year() : -1);

  const months: Option[] = getMonths().map((m) => ({
    id: m.id,
    component: <span>{m.text}</span>,
    onSelect: () => {
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

  const { refetch } = useQuery<GetEmail["response"]>(
    ["emailExists"],
    () => {
      return getData("email/" + getValues("email"));
    },
    { enabled: false }
  );

  const maxNameChars = 50;
  const schema: any = yup.object().shape({
    name: yup.string().required("What's your name?").max(maxNameChars),
    email: yupSequentialStringSchema([
      yup.string().required("Please enter your email."),
      yup.string().email("Please enter a valid email."),
      yup
        .string()
        .test("checkEmail", "This email is already taken", async () => {
          const res = await refetch();
          return !res.data?.data?.emailExists;
        }),
    ]),
  });

  const form = useForm<FormInput>({
    defaultValues: {
      name: name,
      email: email,
    },
    mode: "onTouched",
    resolver: yupResolver(schema),
  });

  const {
    handleSubmit,
    control,
    formState: { isValid },
    getValues,
  } = form;

  const isValidForm = isValid && day !== -1 && month !== -1 && year !== -1;
  const onSubmit: SubmitHandler<FormInput> = ({ name, email }) => {
    setAccountInfo({
      name,
      email,
      birthDate: dayjs().year(year).month(month).date(day),
    });
    nextStep();
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Minipage
        header={
          <StepHeader step={step} onPrevStepClick={() => {}}>
            {header}
          </StepHeader>
        }
        footer={<NextStepButton isDisabled={!isValidForm} />}
      >
        <div className={styles.AccountInfo}>
          <h1>Create your account</h1>
          <div className={styles.Form}>
            <div className={styles.NameEmail}>
              <FormInput
                name="name"
                placeholder="Name"
                control={control}
                maxLength={50}
                autofocus
              />
              <FormInput name="email" placeholder="Email" control={control} />
            </div>
            <div>
              <h4>Date of birth</h4>
              <div className={styles.DateOfBirth}>
                This will not be shown publicly. Confirm your own age, even if
                this account is for a business, a pet, or something else.
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
        </div>
      </Minipage>
    </Form>
  );
};

export default AccountInfo;
