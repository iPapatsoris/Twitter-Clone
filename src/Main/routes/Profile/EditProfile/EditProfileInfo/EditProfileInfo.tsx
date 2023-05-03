import {
  forwardRef,
  RefObject,
  SetStateAction,
  useImperativeHandle,
  useRef,
} from "react";
import { Control } from "react-hook-form";
import { charLimits } from "../../../../../../backend/src/api/user";
import DatePicker from "../../../../../util/components/DatePicker/DatePicker";
import FormInput from "../../../../../util/components/TextInput/FormTextInput";
import { ProfileInfoT } from "../EditProfile";
import styles from "./EditProfileInfo.module.scss";

interface EditProfileInfoProps {
  control: Control<ProfileInfoT>;
  day: number;
  month: number;
  year: number;
  setDay: React.Dispatch<SetStateAction<number>>;
  setMonth: React.Dispatch<SetStateAction<number>>;
  setYear: React.Dispatch<SetStateAction<number>>;
  focusOnAvatar: boolean;
  focusOnCover: boolean;
  setFocusOnAvatar: React.Dispatch<SetStateAction<boolean>>;
  setFocusOnCover: React.Dispatch<SetStateAction<boolean>>;
}

export type PhotoInputRefs = {
  avatarRef: () => RefObject<HTMLInputElement>;
  coverRef: () => RefObject<HTMLInputElement>;
};
const EditProfileInfo = forwardRef<PhotoInputRefs, EditProfileInfoProps>(
  (
    {
      control,
      day,
      month,
      year,
      setDay,
      setMonth,
      setYear,
      focusOnAvatar,
      focusOnCover,
      setFocusOnAvatar,
      setFocusOnCover,
    },
    ref
  ) => {
    const avatarRef = useRef<HTMLInputElement>(null);
    const coverRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(
      ref,
      () => ({ avatarRef: () => avatarRef, coverRef: () => coverRef }),
      []
    );

    console.log("edit profile info: focus is", focusOnAvatar);

    return (
      <div className={styles.EditProfileInfo}>
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
        <FormInput
          name="avatar"
          placeholder="Avatar link"
          control={control}
          ref={avatarRef}
          autofocus={focusOnAvatar}
          onBlur={() => setFocusOnAvatar(false)}
        />
        <FormInput
          name="coverPic"
          placeholder="Cover link"
          control={control}
          ref={coverRef}
          autofocus={focusOnCover}
          onBlur={() => setFocusOnCover(false)}
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
      </div>
    );
  }
);

export default EditProfileInfo;
