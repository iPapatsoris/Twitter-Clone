import { Link } from "react-router-dom";
import styles from "./CreateTweet.module.scss";
import { getPagePath } from "../../../../util/paths";
import { useAuthStore } from "../../../../store/AuthStore";
import Avatar from "../../../routes/Profile/ProfileFace/Avatar/Avatar";
import Widgets from "./Widgets";
import Button from "../../../../util/components/Button/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CreateTweet as CreateTweetAPI,
  tweetCharLimit,
} from "../../../../../backend/src/api/tweet";
import { postData } from "../../../../util/request";
import yup from "../../../../util/yup";
import { UseFormReturn, useController, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Form from "../../../../util/components/Form/Form";
import { timelineKeys } from "../../../../Home/queries";
import TextArea from "../../../../util/components/TextArea/TextArea";
import { useContext, useRef } from "react";
import ProgressBar from "./ProgressBar";
import Icon from "../../../../util/components/Icon/Icon";
import { ReactComponent as CloseIcon } from "../../../../assets/icons/close.svg";
import { ModalContext } from "../../../../util/components/Modal/Modal";

interface CreateTweetProps {
  autofocus?: boolean;
  asModalContent?: boolean;
}

type FormT = { tweet: string };

const CreateTweet = ({
  autofocus = false,
  asModalContent,
}: CreateTweetProps) => {
  const { loggedInUser } = useAuthStore();
  const { setIsActive } = useContext(ModalContext);

  const schema: any = yup.object().shape({
    tweet: yup.string().required().max(tweetCharLimit),
  });

  const form = useForm<FormT>({
    mode: "onTouched",
    resolver: yupResolver(schema),
    defaultValues: {
      tweet: "",
    },
  });

  const {
    handleSubmit,
    control,
    formState: { isValid },
    getValues,
  } = form;

  const {
    field: { onChange, value },
  } = useController({ name: "tweet", control });

  const onSubmit = () => {
    const { tweet } = getValues();
    mutate({ tweet: { text: tweet, isReply: false } });
  };

  const queryClient = useQueryClient();

  const { mutate } = useMutation<
    CreateTweetAPI["response"],
    unknown,
    CreateTweetAPI["request"]
  >((body) => postData("tweet", body), {
    onSuccess: (data) => {
      if (data.ok) {
        form.reset();
        queryClient.invalidateQueries(
          timelineKeys.timeline(queryClient).queryKey
        );
      }
    },
  });

  const avatarRef = useRef<HTMLDivElement>(null);

  if (!loggedInUser) {
    return null;
  }
  const progressBarInfo = getProgressBarInfo(form);

  return (
    <div
      className={[
        styles.CreateTweet,
        asModalContent ? styles.AsModalContent : "",
      ].join(" ")}
    >
      {asModalContent && (
        <Icon
          src={CloseIcon}
          onClick={() => setIsActive(false)}
          title="Close"
          alt="Close"
          extraWrapperStyles={[styles.CloseIcon]}
        />
      )}
      <div ref={avatarRef} className={styles.Avatar}>
        <Link to={getPagePath("profile", loggedInUser?.username)}>
          <Avatar src={loggedInUser.avatar} />
        </Link>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <TextArea
          extraStyles={[styles.TextArea]}
          textareaProps={{
            name: "tweet",
            value: value,
            onChange,
            placeholder: "What is happening?!",
            autoFocus: autofocus,
          }}
          refToAlignTopRowWith={avatarRef}
        />
        {!asModalContent ? <></> : <div className={styles.Border}></div>}
        <Widgets />
        <ProgressBar tweetCharLimit={tweetCharLimit} {...progressBarInfo} />
        <div className={styles.Action}>
          <Button type="submit" disabled={!isValid} size="medium">
            Post
          </Button>
        </div>
      </Form>
    </div>
  );
};

const getProgressBarInfo = (form: UseFormReturn<FormT>) => {
  const charsWritten = form.getValues("tweet").length;
  const showCharsWarning = charsWritten >= tweetCharLimit - 20;
  let progressColor = "var(--primary-color)";
  let textColor = "var(--light-color)";
  if (showCharsWarning) {
    progressColor = "rgb(255, 212, 0)";
  }
  if (charsWritten >= tweetCharLimit) {
    progressColor = "red";
    textColor = "red";
  }

  return { charsWritten, showCharsWarning, progressColor, textColor };
};

export default CreateTweet;
