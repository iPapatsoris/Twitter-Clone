import { Link } from "react-router-dom";
import styles from "./CreateTweet.module.scss";
import { getPagePath } from "../../../../util/paths";
import { useAuthStore } from "../../../../store/AuthStore";
import Avatar from "../../../routes/Profile/ProfileFace/Avatar/Avatar";
import Input from "../../../../util/components/Input/Input";
import Icon from "../../../../util/components/Icon/Icon";
import Widgets from "./Widgets";
import Button from "../../../../util/components/Button/Button";
import { useMutation } from "@tanstack/react-query";
import {
  CreateTweet as CreateTweetAPI,
  tweetCharLimit,
} from "../../../../../backend/src/api/tweet";
import { postData } from "../../../../util/request";
import yup from "../../../../util/yup";
import { useController, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Form from "../../../../util/components/Form/Form";

interface CreateTweetProps {}

const CreateTweet = ({}: CreateTweetProps) => {
  const { loggedInUser } = useAuthStore();
  const { mutate, isLoading } = useMutation<
    CreateTweetAPI["response"],
    unknown,
    CreateTweetAPI["request"]
  >((body) => postData("tweet", body), {
    onSuccess: (data) => {
      if (data.ok) {
        console.log("ok");
      }
    },
  });

  const schema: any = yup.object().shape({
    tweet: yup.string().required().max(tweetCharLimit),
  });

  const form = useForm<{ tweet: string }>({
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
    field: { onChange, onBlur, value, ref: register },
    fieldState: { isDirty, error, invalid },
  } = useController({ name: "tweet", control });

  const onSubmit = () => {
    const { tweet } = getValues();
    console.log("hello");

    mutate({ tweet: { text: tweet, isReply: false } });
  };

  if (!loggedInUser) {
    return null;
  }

  return (
    <div className={styles.CreateTweet}>
      <div className={styles.Avatar}>
        <Link to={getPagePath("profile", loggedInUser?.username)}>
          <Avatar src={loggedInUser.avatar} />
        </Link>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <textarea
          name="tweet"
          value={value}
          onChange={onChange}
          placeholder="What is happening?!"
        />
        <Widgets />
        <Button
          type="submit"
          disabled={!isValid}
          size="medium"
          extraClasses={[styles.PostButton]}
        >
          Post
        </Button>
      </Form>
    </div>
  );
};

export default CreateTweet;
