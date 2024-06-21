import {
  forwardRef,
  useRef,
  useState,
  ForwardedRef,
  ReactElement,
  ReactNode,
  FocusEvent,
  MouseEvent,
  ComponentProps,
} from "react";
import styles from "./Input.module.scss";
import { ReactComponent as EyeIcon } from "../../../assets/icons/eye.svg";
import { ReactComponent as EyeStrikeIcon } from "../../../assets/icons/eye-strike.svg";
import { ReactComponent as SuccessIcon } from "../../../assets/icons/success.svg";
import { ReactComponent as ErrorIcon } from "../../../assets/icons/error.svg";
import Icon from "../Icon/Icon";
import useForwardRef from "../../hooks/useForwardRef";

export type InputType = HTMLInputElement | HTMLTextAreaElement;
type CustomProps = {
  isValid?: boolean;
  showStatusIcon?: boolean;
  error?: string;
  helper?: ReactElement;
  leader?: ReactNode;
};

export type NormalInputProps = ComponentProps<"input"> &
  CustomProps & {
    type?: "text" | "password";
  };
export type TextareaInputProps = ComponentProps<"textarea"> &
  CustomProps & {
    type?: "textarea";
  };

type InputProps = NormalInputProps | TextareaInputProps;

const Input = forwardRef<InputType, InputProps>((props, fref) => {
  const {
    placeholder,
    maxLength,
    readOnly,
    onFocus,
    onBlur,
    onMouseDown,
    value,
    isValid = true,
    error,
    helper,
    type: initialType = "text",
    showStatusIcon,
    leader,
    ...nativeProps
  } = props;

  const inputRef = useRef<InputType>(null);
  const ref = useForwardRef(fref, inputRef);
  const [isFocused, setIsFocused] = useState(false);
  const [inputType, setInputType] = useState(initialType);

  const togglePasswordReveal = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inputType === "password") {
      setInputType("text");
    } else {
      setInputType("password");
    }
  };

  const handleWrapperMousedown = (e: React.MouseEvent) => {
    if (ref && ref.current && !readOnly) {
      // Mouse down on wrapper div would blur the inner input that we are
      // trying to manually focus on, prevent this behavior.
      e.preventDefault();
      ref.current.focus({ preventScroll: true });
    }
  };

  const wrapperStyles: Array<keyof typeof styles> = [styles.Wrapper];
  const isEmpty =
    value === undefined || (typeof value === "string" && !value.length);

  // UI states
  if (isFocused) {
    wrapperStyles.push(styles.Focused);
  }
  if (error) {
    wrapperStyles.push(styles.Error);
  }
  if (isEmpty) {
    wrapperStyles.push(styles.Empty);
  }

  // Password hide/reveal or status icon
  let iconJSX;
  if (initialType === "password") {
    iconJSX = (
      <Icon
        src={inputType === "password" ? EyeIcon : EyeStrikeIcon}
        onClick={(e) => togglePasswordReveal(e)}
        hover="none"
      />
    );
  } else if (showStatusIcon) {
    if (error) {
      iconJSX = <Icon src={ErrorIcon} hover="none" />;
    } else if (isValid) {
      iconJSX = (
        <Icon
          src={SuccessIcon}
          extraStyles={[styles.SuccessIcon]}
          hover="none"
        />
      );
    }
  }

  const inputProps: InputProps = {
    ...nativeProps,
    placeholder: "",
    onFocus: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setIsFocused(true);
      onFocus && onFocus(e as any);
      /* Note on TS: using "any" for the event above results in cleaner code 
         than conditionally choosing which "onFocus" to use based on "inputType". 
         And we are not losing any realistic type safety. 
      */
    },
    onBlur: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setIsFocused(false);
      onBlur && onBlur(e as any);
    },
    onMouseDown: (e: MouseEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      /* Parent Wrapper element calls preventDefault() on onMouseDown. We need 
           to stop propagation from child input element, because otherwise text 
           highlighting (mouse down default behavior) will not work.
        */
      e.stopPropagation();
      onMouseDown && onMouseDown(e as any);
    },
  };

  let input;
  if (initialType === "textarea") {
    input = (
      <textarea
        {...(inputProps as TextareaInputProps)}
        ref={ref as ForwardedRef<HTMLTextAreaElement>}
      />
    );
  } else {
    input = (
      <input
        {...(inputProps as NormalInputProps)}
        type={inputType}
        ref={ref as ForwardedRef<HTMLInputElement>}
      />
    );
  }

  return (
    <div>
      <div
        className={wrapperStyles.join(" ")}
        onMouseDown={handleWrapperMousedown}
      >
        {!isFocused && isEmpty && (
          <div className={styles.Placeholder}>
            <span>{placeholder}</span>
          </div>
        )}
        <div className={styles.TypingArea}>
          <div className={styles.Info}>
            <label htmlFor="input" className={styles.Label}>
              {placeholder}
            </label>
            {maxLength && typeof value === "string" && (
              <span className={styles.MaxCount}>
                {value?.length} / {maxLength}
              </span>
            )}
          </div>
          <div className={styles.Input}>
            <span>{leader}</span>
            {input}
            {iconJSX}
          </div>
        </div>
      </div>
      <div className={[styles.HelperBox, error ? styles.Error : ""].join(" ")}>
        {error ? error : helper}
      </div>
      {helper && error && <div className={styles.HelperBox}>{helper}</div>}
    </div>
  );
});

export default Input;
