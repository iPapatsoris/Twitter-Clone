import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  ForwardedRef,
  HTMLProps,
  ReactElement,
  ReactNode,
} from "react";
import styles from "./Input.module.scss";
import { ReactComponent as EyeIcon } from "../../../assets/icons/eye.svg";
import { ReactComponent as EyeStrikeIcon } from "../../../assets/icons/eye-strike.svg";
import { ReactComponent as SuccessIcon } from "../../../assets/icons/success.svg";
import { ReactComponent as ErrorIcon } from "../../../assets/icons/error.svg";
import Icon from "../Icon/Icon";
import useForwardRef from "../../hooks/useForwardRef";

/* 
  Props that are passed to Input component but should NOT be passed to the
  internal JSX element because they are not real input HTML attributes.
  By defining them in a class, we maintain a single source of truth for TS
  and can automatically bridge them into JS into "nonHTMLProps" array below.
  Alternative methods would require typing them twice.
*/
class NonHTMLProps {
  constructor(
    readonly isValid?: boolean,
    readonly showStatusIcon?: boolean,
    readonly error?: string,
    readonly helper?: ReactElement,
    readonly leader?: ReactNode
  ) {}
}

// Generate nonHtmlProps array to prevent passing them to JSX input element later
const nonHTMLProps = Object.keys(new NonHTMLProps()) as Array<
  keyof NonHTMLProps
>;

interface InputProps
  extends HTMLProps<HTMLInputElement | HTMLTextAreaElement>,
    NonHTMLProps {
  type?: "text" | "password" | "textArea";
  value: string;
}

export type RefType = HTMLInputElement | HTMLTextAreaElement;
const Input = forwardRef<RefType, InputProps>((props, fref) => {
  const {
    placeholder,
    maxLength,
    autoFocus,
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
  } = props;

  const inputRef = useRef<RefType>(null);
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

  // UI states
  if (isFocused) {
    wrapperStyles.push(styles.Focused);
  }
  if (error) {
    wrapperStyles.push(styles.Error);
  }
  if (!value.length) {
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

  // Override some props
  const inputProps: InputProps = {
    ...props,
    type: inputType,
    placeholder: "",
    onFocus: (e) => {
      setIsFocused(true);
      onFocus && onFocus(e);
    },
    onBlur: (e) => {
      setIsFocused(false);
      onBlur && onBlur(e);
    },
    onMouseDown: (e) => {
      /* Parent Wrapper element calls preventDefault() on onMouseDown. We need 
           to stop propagation from child input element, because otherwise text 
           highlighting (mouse down default behavior) will not work.
        */
      e.stopPropagation();
      onMouseDown && onMouseDown(e);
    },
  };

  // Remove wrapper exclusive props
  nonHTMLProps.forEach((p) => delete inputProps[p]);

  let input;
  if (inputType === "textArea") {
    input = (
      <textarea
        {...inputProps}
        ref={ref as ForwardedRef<HTMLTextAreaElement>}
      />
    );
  } else {
    input = (
      <input {...inputProps} ref={ref as ForwardedRef<HTMLInputElement>} />
    );
  }

  return (
    <div>
      <div
        className={wrapperStyles.join(" ")}
        onMouseDown={handleWrapperMousedown}
      >
        {!isFocused && !value.length && (
          <div className={styles.Placeholder}>
            <span>{placeholder}</span>
          </div>
        )}
        <div className={styles.TypingArea}>
          <div className={styles.Info}>
            <label htmlFor="input" className={styles.Label}>
              {placeholder}
            </label>
            {maxLength && (
              <span className={styles.MaxCount}>
                {value.length} / {maxLength}
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
