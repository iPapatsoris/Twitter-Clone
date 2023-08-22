import { yupResolver } from "@hookform/resolvers/yup";
import dayjs from "dayjs";
import { RefObject, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { charLimits, UpdateUser } from "../../../../../../backend/src/api/user";
import { UpdateUserFields } from "../../../../../../backend/src/permissions";
import { useAuthStore } from "../../../../../store/AuthStore";
import Form from "../../../../../util/components/Form/Form";
import Minipage from "../../../../../util/layouts/Minipage/Minipage";
import yup from "../../../../../util/yup";
import { profileKeys, UserProfileT } from "../queries";
import profileStyles from "../../Profile.module.scss";
import EditProfileHeader from "./EditProfileHeader/EditProfileHeader";
import EditProfileInfo, {
  PhotoInputRefs,
} from "./EditProfileInfo/EditProfileInfo";
import EditProfilePhotos from "./EditProfilePhotos/EditProfilePhotos";
import { patchData } from "../../../../../util/request";

interface EditProfileProps {
  user: UserProfileT;
  closeModal: VoidFunction;
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
  UpdateUser<(typeof requestFields)[number]>["request"]["user"],
  "birthDate"
>;

const EditProfile = ({ user, closeModal }: EditProfileProps) => {
  const birthDate = dayjs(user.birthDate);
  const [month, setMonth] = useState(birthDate ? birthDate.month() : -1);
  const [day, setDay] = useState(birthDate ? birthDate.date() : -1);
  const [year, setYear] = useState(birthDate ? birthDate.year() : -1);

  const setLoggedInUserMiniInfo = useAuthStore(
    (state) => state.setLoggedInUserMiniInfo
  );
  const queryClient = useQueryClient();

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
    UpdateUser<(typeof requestFields)[number]>["response"],
    unknown,
    UpdateUser<UpdateUserFields>["request"]
  >(async (body) =>
    patchData<
      UpdateUser<(typeof requestFields)[number]>["response"],
      (typeof requestFields)[number]
    >("user", body, requestFields)
  );

  const isValidForm = isValid && day !== -1 && month !== -1 && year !== -1;

  const onSubmit: SubmitHandler<ProfileInfoT> = (formUser) => {
    const birthDate = dayjs().year(year).month(month).date(day);
    const newUser: UpdateUser<UpdateUserFields>["request"]["user"] = {
      ...formUser,
      birthDate: birthDate.format("YYYY-MM-DD"),
    };
    mutate(
      {
        user: newUser,
      },
      {
        onSuccess: async () => {
          queryClient.invalidateQueries({
            queryKey: profileKeys.username(user.username).queryKey,
          });
          setLoggedInUserMiniInfo({
            avatar: newUser.avatar,
            name: newUser.name,
          });
          closeModal();
        },
      }
    );
  };

  const scrollToInput = (ref: RefObject<HTMLInputElement>) => {
    if (ref && ref.current) ref.current.scrollIntoView({ behavior: "smooth" });
  };

  const ref = useRef<PhotoInputRefs>(null);

  const [focusOnAvatar, setFocusOnAvatar] = useState(false);
  const [focusOnCover, setFocusOnCover] = useState(false);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Minipage
        alignContent="none"
        header={<EditProfileHeader disableUpdate={!isValidForm} />}
      >
        <div className={[profileStyles.Profile, profileStyles.Edit].join(" ")}>
          <EditProfilePhotos
            coverPic={user.coverPic}
            avatar={user.avatar}
            focusOnAvatar={() => {
              scrollToInput(ref!.current!.avatarRef());
              setFocusOnAvatar(true);
            }}
            focusOnCover={() => {
              scrollToInput(ref!.current!.coverRef());
              setFocusOnCover(true);
            }}
          />
          <EditProfileInfo
            control={control}
            day={day}
            month={month}
            year={year}
            setDay={setDay}
            setMonth={setMonth}
            setYear={setYear}
            ref={ref}
            focusOnAvatar={focusOnAvatar}
            focusOnCover={focusOnCover}
            setFocusOnAvatar={setFocusOnAvatar}
            setFocusOnCover={setFocusOnCover}
          />
        </div>
      </Minipage>
    </Form>
  );
};

export default EditProfile;
