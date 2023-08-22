import styles from "./AccountInfo.module.scss";
import { SetStateAction, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import dayjs from "dayjs";
import { yupResolver } from "@hookform/resolvers/yup";
import FormInput from "../../../util/components/Input/FormInput";
import { AccountInfoT } from "../../Signup";
import useStepper from "../../../util/hooks/useStepper";
import NextStepButton from "../NextStepButton";
import StepHeader from "../StepHeader";
import Minipage from "../../../util/layouts/Minipage/Minipage";
import Form from "../../../util/components/Form/Form";
import { useQuery } from "@tanstack/react-query";
import { GetEmail } from "../../../../backend/src/api/email";
import yup, { yupSequentialStringSchema } from "../../../util/yup";
import DatePicker from "../../../util/components/DatePicker/DatePicker";
import { charLimits } from "../../../../backend/src/api/user";
import { getData } from "../../../util/request";
import useWindowDimensions from "../../../util/hooks/useWindowDimensions";

interface AccountInfoProps {
  accountInfo: AccountInfoT;
  setAccountInfo: React.Dispatch<SetStateAction<AccountInfoT>>;
  stepper: ReturnType<typeof useStepper>;
  header?: string;
  inputToFocus?: keyof AccountInfoT;
}

const AccountInfo = ({
  stepper: { step, nextStep },
  accountInfo: { name, email, birthDate },
  setAccountInfo,
  header = "",
  inputToFocus = "name",
}: AccountInfoProps) => {
  const [month, setMonth] = useState(birthDate ? birthDate.month() : -1);
  const [day, setDay] = useState(birthDate ? birthDate.date() : -1);
  const [year, setYear] = useState(birthDate ? birthDate.year() : -1);

  const { refetch } = useQuery<GetEmail["response"]>(
    ["emailExists"],
    () => {
      return getData("email/" + getValues("email"));
    },
    { enabled: false }
  );

  const schema: any = yup.object().shape({
    name: yup.string().required("What's your name?").max(charLimits.name),
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

  const form = useForm<AccountInfoT>({
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
  const onSubmit: SubmitHandler<AccountInfoT> = ({ name, email }) => {
    setAccountInfo({
      name,
      email,
      birthDate: dayjs().year(year).month(month).date(day),
    });
    nextStep();
  };

  const { isMobile, isTablet } = useWindowDimensions();

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Minipage
        alignContent={isMobile || isTablet ? "icon" : "header"}
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
                autofocus={inputToFocus === "name"}
              />
              <FormInput
                name="email"
                placeholder="Email"
                control={control}
                autofocus={inputToFocus === "email"}
              />
            </div>
            <div>
              <h4>Date of birth</h4>
              <div className={styles.DateOfBirth}>
                This will not be shown publicly. Confirm your own age, even if
                this account is for a business, a pet, or something else.
              </div>
              <DatePicker
                day={day}
                month={month}
                year={year}
                setDay={setDay}
                setMonth={setMonth}
                setYear={setYear}
              />
            </div>
          </div>
        </div>
      </Minipage>
    </Form>
  );
};

export default AccountInfo;
