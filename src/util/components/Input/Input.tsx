import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  ForwardedRef,
  HTMLProps,
} from "react";
import styles from "./Input.module.scss";
import { ReactComponent as EyeIcon } from "../../../assets/icons/eye.svg";
import { ReactComponent as EyeStrikeIcon } from "../../../assets/icons/eye-strike.svg";
import { ReactComponent as SuccessIcon } from "../../../assets/icons/success.svg";
import { ReactComponent as ErrorIcon } from "../../../assets/icons/error.svg";
import Icon from "../Icon/Icon";
import useForwardRef from "../../hooks/useForwardRef";

interface InputProps {
  name: string;
  placeholder: string;
  type?: "text" | "password" | "textArea";
  maxLength?: number;
  autofocus?: boolean;
  readonly?: boolean;
  onFocus?: (e: React.FocusEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
  onBlur?: (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  value: string;
  isValid?: boolean;
  error?: string;
  helper?: React.ReactElement;
  showStatusIcon?: boolean;
  leader?: React.ReactNode;
  autocomplete?: HTMLProps<HTMLInputElement>["autoComplete"];
}

export type RefType = HTMLInputElement | HTMLTextAreaElement;
const Input = forwardRef<RefType, InputProps>(
  (
    {
      name,
      placeholder,
      maxLength,
      autofocus = false,
      readonly = false,
      onFocus,
      onChange,
      onBlur,
      onClick,
      value,
      isValid = true,
      error,
      helper,
      type: initialType = "text",
      showStatusIcon = false,
      leader = "",
      autocomplete,
    },
    fref
  ) => {
    const wrapperRef = useRef<HTMLDivElement>(null);

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

    useEffect(() => {
      if (autofocus && ref && ref.current) {
        ref.current?.focus({ preventScroll: true });
      }
    }, [autofocus, ref]);

    const handleWrapperMousedown = (e: React.MouseEvent) => {
      if (ref && ref.current && !readonly) {
        // Mouse down on wrapper div would blur the inner input that we are
        // trying to manually focus on, prevent this behavior.
        e.preventDefault();
        ref.current.focus({ preventScroll: true });
      }
    };

    const wrapperStyles: styles.ClassNames[] = [styles.Wrapper];

    if (isFocused) {
      wrapperStyles.push(styles.Focused);
    }
    if (error) {
      wrapperStyles.push(styles.Error);
    }
    if (!value.length) {
      wrapperStyles.push(styles.Empty);
    }

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

    const inputProps: HTMLProps<HTMLInputElement | HTMLTextAreaElement> = {
      name,
      maxLength,
      onChange,
      onClick,
      onFocus: (e) => {
        setIsFocused(true);
        onFocus && onFocus(e);
      },
      onBlur: (e) => {
        setIsFocused(false);
        onBlur && onBlur(e);
      },
      value,
      readOnly: readonly,
      onMouseDown: (e: React.MouseEvent) => {
        /* Parent Wrapper element calls preventDefault() on onMouseDown. We need 
           to stop propagation from child input element, because otherwise text 
           highlighting (mouse down default behavior) will not work.
        */
        e.stopPropagation();
      },
    };

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
        <input
          {...inputProps}
          ref={ref as ForwardedRef<HTMLInputElement>}
          type={inputType}
          autoComplete={autocomplete}
        />
      );
    }

    return (
      <div>
        <div
          ref={wrapperRef}
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
              <span className={styles.Leader}>{leader}</span>
              {input}
              {iconJSX}
            </div>
          </div>
        </div>
        <div
          className={[styles.HelperBox, error ? styles.Error : ""].join(" ")}
        >
          {error ? error : helper}
        </div>
        {helper && error && <div className={styles.HelperBox}>{helper}</div>}
      </div>
    );
  }
);

export default Input;
