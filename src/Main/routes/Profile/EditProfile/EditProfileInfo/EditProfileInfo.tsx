import { yupResolver } from "@hookform/resolvers/yup";
import dayjs from "dayjs";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { charLimits } from "../../../../../../backend/src/api/user";
import DatePicker from "../../../../../util/components/DatePicker/DatePicker";
import Form from "../../../../../util/components/Form/Form";
import FormInput from "../../../../../util/components/TextInput/FormTextInput";
import useRequest from "../../../../../util/hooks/useRequest";
import yup from "../../../../../util/yup";
import { UserProfileT } from "../../Profile";
import styles from "./EditProfileInfo.module.scss";

interface EditProfileInfoProps {
  user: UserProfileT;
}

const EditProfileInfo = ({ user }: EditProfileInfoProps) => {
  const birthDate = dayjs(user.birthDate);
  const [month, setMonth] = useState(birthDate ? birthDate.month() : -1);
  const [day, setDay] = useState(birthDate ? birthDate.date() : -1);
  const [year, setYear] = useState(birthDate ? birthDate.year() : -1);

  const { postData } = useRequest();

  type ProfileInfoT = Pick<
    UserProfileT,
    "name" | "bio" | "location" | "website"
  >;
  const schema: yup.ObjectSchema<ProfileInfoT> = yup.object().shape({
    name: yup.string().required("Name can't be blank.").max(charLimits.name),
    bio: yup.string().max(charLimits.bio),
    location: yup.string().max(charLimits.location),
    website: yup.string().max(100),
  });

  const form = useForm<ProfileInfoT>({
    defaultValues: {
      name: user.name,
      bio: user.bio,
      location: user.location,
      website: user.website,
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
  const onSubmit: SubmitHandler<ProfileInfoT> = ({
    name,
    bio,
    location,
    website,
  }) => {
    // mutate
  };

  return (
    <div className={styles.EditProfileInfo}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormInput
          name="name"
          placeholder="Name"
          control={control}
          maxLength={charLimits.name}
        />
        <FormInput
          name="bio"
          placeholder="Bio"
          control={control}
          maxLength={charLimits.bio}
          type="textArea"
        />
        <FormInput
          name="location"
          placeholder="Location"
          control={control}
          maxLength={charLimits.location}
        />
        <FormInput
          name="website"
          placeholder="Website"
          control={control}
          maxLength={charLimits.website}
        />
        <div>
          <span className={styles.LightColor}>Birth date</span>
          <DatePicker
            day={day}
            month={month}
            year={year}
            setDay={setDay}
            setMonth={setMonth}
            setYear={setYear}
          />
        </div>
      </Form>
    </div>
  );
};

export default EditProfileInfo;
