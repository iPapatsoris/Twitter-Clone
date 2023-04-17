import { yupResolver } from "@hookform/resolvers/yup";
import dayjs from "dayjs";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { charLimits, UpdateUser } from "../../../../../backend/src/api/user";
import { UpdateUserFields } from "../../../../../backend/src/permissions";
import Form from "../../../../util/components/Form/Form";
import useRequest from "../../../../util/hooks/useRequest";
import Minipage from "../../../../util/layouts/Minipage/Minipage";
import yup from "../../../../util/yup";
import { UserProfileT } from "../Profile";
import styles from "./EditProfile.module.scss";
import EditProfileHeader from "./EditProfileHeader/EditProfileHeader";
import EditProfileInfo from "./EditProfileInfo/EditProfileInfo";
import EditProfilePhotos from "./EditProfilePhotos/EditProfilePhotos";

interface EditProfileProps {
  user: UserProfileT;
}
const requestFields = [
  "name",
  "bio",
  "location",
  "website",
  "avatar",
  "coverPic",
  "birthDate",
] as const satisfies Readonly<Array<UpdateUserFields>>;
export type ProfileInfoT = Omit<
  UpdateUser<typeof requestFields[number]>["request"]["user"],
  "birthDate"
>;

const EditProfile = ({ user }: EditProfileProps) => {
  const birthDate = dayjs(user.birthDate);
  const [month, setMonth] = useState(birthDate ? birthDate.month() : -1);
  const [day, setDay] = useState(birthDate ? birthDate.date() : -1);
  const [year, setYear] = useState(birthDate ? birthDate.year() : -1);

  const { patchData } = useRequest();

  const schema: yup.ObjectSchema<ProfileInfoT> = yup.object().shape({
    name: yup.string().required("Name can't be blank.").max(charLimits.name),
    bio: yup.string().max(charLimits.bio),
    location: yup.string().max(charLimits.location),
    website: yup.string().max(100),
    avatar: yup.string(),
    coverPic: yup.string(),
  });

  const form = useForm<ProfileInfoT>({
    defaultValues: {
      name: user.name,
      bio: user.bio,
      location: user.location,
      website: user.website,
      avatar: user.avatar,
      coverPic: user.coverPic,
    },
    mode: "onTouched",
    resolver: yupResolver(schema),
  });

  const {
    handleSubmit,
    control,
    formState: { isValid },
  } = form;

  const { mutate } = useMutation<
    UpdateUser<typeof requestFields[number]>["response"],
    unknown,
    UpdateUser<UpdateUserFields>["request"]
  >(async (body) =>
    patchData<typeof requestFields[number]>("user", body, requestFields)
  );

  const isValidForm = isValid && day !== -1 && month !== -1 && year !== -1;

  const onSubmit: SubmitHandler<ProfileInfoT> = (formUser) => {
    const birthDate = dayjs().year(year).month(month).date(day);
    mutate({
      user: {
        ...formUser,
        birthDate: birthDate.format("YYYY-MM-DD"),
      },
    });
  };
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Minipage
        alignHeaderWithContent={false}
        header={<EditProfileHeader disableUpdate={!isValidForm} />}
      >
        <div className={styles.EditProfile}>
          <EditProfilePhotos coverPic={user.coverPic} avatar={user.avatar} />
          <EditProfileInfo
            control={control}
            day={day}
            month={month}
            year={year}
            setDay={setDay}
            setMonth={setMonth}
            setYear={setYear}
          />
        </div>
      </Minipage>
    </Form>
  );
};

export default EditProfile;
