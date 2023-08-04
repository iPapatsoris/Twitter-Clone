import { ComponentProps } from "react";
import styles from "./TextArea.module.scss";
import TextareaAutosize from "react-textarea-autosize";

const TextArea = (textareaProps: ComponentProps<typeof TextareaAutosize>) => (
  <TextareaAutosize className={styles.TextArea} {...textareaProps} />
);
export default TextArea;
