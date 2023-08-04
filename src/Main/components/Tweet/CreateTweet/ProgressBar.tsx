import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import styles from "./CreateTweet.module.scss";

interface ProgressBarProps {
  tweetCharLimit: number;
  charsWritten: number;
  showCharsWarning: boolean;
  textColor: string;
  progressColor: string;
}

const ProgressBar = ({
  tweetCharLimit,
  charsWritten,
  showCharsWarning,
  textColor,
  progressColor,
}: ProgressBarProps) => (
  <div className={styles.Progress}>
    <CircularProgressbar
      minValue={0}
      maxValue={tweetCharLimit}
      value={charsWritten}
      text={showCharsWarning ? (tweetCharLimit - charsWritten).toString() : ""}
      strokeWidth={5}
      styles={buildStyles({
        textSize: "37px",
        textColor,
        pathColor: progressColor,
      })}
    />
  </div>
);

export default ProgressBar;
