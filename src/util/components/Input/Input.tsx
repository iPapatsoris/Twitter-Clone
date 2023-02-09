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
  const [name, setName] = useState("");

  useClickOutside(wrapperRef, () => setIsFocused(false));

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
      setIsFocused(true);
    }
  };

  const wrapperStyles: styles.InputNames[] = [styles.Wrapper];
  const typingStyles: styles.InputNames[] = [styles.Typing];
  if (isFocused) {
    wrapperStyles.push(styles.Focused);
    typingStyles.push(styles.ShowOpacity);
  }

  return (
    <div
      ref={wrapperRef}
      className={wrapperStyles.join(" ")}
      onClick={handleClick}
    >
      {!isFocused && (
        <div className={styles.Placeholder}>
          <span>{placeholder}</span>
        </div>
      )}
      <div className={typingStyles.join(" ")}>
        <div className={styles.Info}>
          <label htmlFor="input">{placeholder}</label>
          {characterLimit && (
            <span>
              {name.length} / {characterLimit}
            </span>
          )}
        </div>
        <input
          id="input"
          ref={inputRef}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Input;
