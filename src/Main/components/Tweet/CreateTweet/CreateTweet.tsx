import { Link, useLocation } from "react-router-dom";
import styles from "./CreateTweet.module.scss";
import { getPagePath } from "../../../../util/paths";
import Avatar from "../../../routes/Profile/ProfileFace/Avatar/Avatar";
import Widgets from "./Widgets";
import Button from "../../../../util/components/Button/Button";
import {} from "@tanstack/react-query";
import { tweetCharLimit } from "../../../../../backend/src/api/tweet";
import yup from "../../../../util/yup";
import { UseFormReturn, useController, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Form from "../../../../util/components/Form/Form";
import TextArea from "../../../../util/components/TextArea/TextArea";
import { useContext, useRef } from "react";
import ProgressBar from "./ProgressBar";
import Icon from "../../../../util/components/Icon/Icon";
import { ReactComponent as CloseIcon } from "../../../../assets/icons/close.svg";
import { ModalContext } from "../../../../util/components/Modal/Modal";
import Tweet from "../Tweet";
import { useLoggedInUser } from "../../../../store/AuthStore";
import useCreateTweetMutation from "./queries";

interface CreateTweetProps {
  autofocus?: boolean;
  asModalContent?: boolean;
  // Pass this prop only if we are replying to a tweet
  referencedTweetID?: number;
}

export type CreateTweetForm = { tweet: string };

const CreateTweet = ({
  autofocus = false,
  asModalContent,
  referencedTweetID,
}: CreateTweetProps) => {
  const loggedInUser = useLoggedInUser();
  const { state: routerState } = useLocation();
  const { setIsActive } = useContext(ModalContext);
  const isReply = referencedTweetID !== undefined;
  const isReplyInModal = isReply && asModalContent;

  const schema: any = yup.object().shape({
    tweet: yup.string().required().max(tweetCharLimit),
  });

  const form = useForm<CreateTweetForm>({
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
    mutate({ tweet: { text: tweet, isReply, referencedTweetID } });
  };

  const { mutate } = useCreateTweetMutation({
    referencedTweetID,
    asModalContent,
    isReply,
    form,
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
        isReply ? styles.Replying : "",
      ].join(" ")}
    >
      {asModalContent && (
        <Icon
          src={CloseIcon}
          onClick={() => setIsActive(false)}
          title="Close"
          alt="Close"
          extraWrapperStyles={[styles.CloseIcon]}
          noInlineMargin
        />
      )}
      {isReplyInModal && (
        <div className={styles.TweetToReplyTo}>
          <Tweet tweetID={referencedTweetID} drawReplyLine simpleView />
        </div>
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
            placeholder: isReply ? "Post a reply" : "What is happening?!",
            autoFocus: autofocus || (routerState && routerState.autofocus),
          }}
          refToAlignTopRowWith={avatarRef}
        />
        {asModalContent ? <div className={styles.Border}></div> : <></>}
        <Widgets isReply={isReply} />
        <ProgressBar tweetCharLimit={tweetCharLimit} {...progressBarInfo} />
        <div className={styles.Action}>
          <Button type="submit" disabled={!isValid} size="medium">
            {isReply ? "Reply" : "Post"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

const getProgressBarInfo = (form: UseFormReturn<CreateTweetForm>) => {
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
