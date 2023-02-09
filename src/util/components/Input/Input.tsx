import { useRef, useState } from "react";
import useClickOutside from "../../hooks/useClickOutside";
import styles from "./Input.module.scss";

interface InputProps {
  placeholder: string;
  characterLimit?: number;
}

const Input = ({ placeholder, characterLimit }: InputProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState("");

  useClickOutside(wrapperRef, () => setIsFocused(false));

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
      setIsFocused(true);
    }
  };

  const wrapperStyles: styles.InputNames[] = [styles.Wrapper];
  const typingAreaStyles: styles.InputNames[] = [styles.TypingArea];
  const labelStyles: styles.InputNames[] = [];
  if (isFocused || value.length) {
    typingAreaStyles.push(styles.ShowOpacity);
    if (isFocused) {
      wrapperStyles.push(styles.Focused);
      labelStyles.push(styles.Color);
    }
  }

  return (
    <div
      ref={wrapperRef}
      className={wrapperStyles.join(" ")}
      onClick={handleClick}
    >
      {!isFocused && !value.length && (
        <div className={styles.Placeholder}>
          <span>{placeholder}</span>
        </div>
      )}
      <div className={typingAreaStyles.join(" ")}>
        <div className={styles.Info}>
          <label htmlFor="input" className={labelStyles.join(" ")}>
            {placeholder}
          </label>
          {characterLimit && (
            <span>
              {value.length} / {characterLimit}
            </span>
          )}
        </div>
        <input
          id="input"
          ref={inputRef}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Input;
