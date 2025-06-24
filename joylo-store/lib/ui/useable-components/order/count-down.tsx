import { useApptheme } from "@/lib/context/theme.context";
import React, { useEffect, useState } from "react";
import { Text } from "react-native";

interface CountdownTimerProps {
  initialMinutes: number;
  setTimeUp: React.Dispatch<React.SetStateAction<boolean>>;
  startTime?: number; // Optional parameter for custom start time
}

const CountdownTimer2: React.FC<CountdownTimerProps> = ({
  initialMinutes,
  setTimeUp,
  startTime,
}) => {
  const { appTheme } = useApptheme();
  const [timeLeft, setTimeLeft] = useState<number>(initialMinutes * 60);

  useEffect(() => {
    // If startTime is provided, calculate remaining time based on that
    if (startTime) {
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
      const initialSeconds = initialMinutes * 60;
      const remaining = Math.max(0, initialSeconds - elapsedSeconds);

      // If time is already up on initialization, set the timeUp state
      if (remaining <= 0) {
        setTimeUp(true);
      }

      setTimeLeft(remaining);
    } else {
      // Otherwise use the initialMinutes directly
      setTimeLeft(initialMinutes * 60);
    }
  }, [initialMinutes, startTime, setTimeUp]);

  useEffect(() => {
    if (timeLeft <= 0) {
      setTimeUp(true);
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(intervalId);
          setTimeUp(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, setTimeUp]);

  // Ensure minutes is never negative
  const minutes = Math.max(0, Math.floor(timeLeft / 60));
  const seconds = Math.max(0, timeLeft % 60);

  return (
    <Text
      style={{
        color: timeLeft <= 60 ? appTheme.textErrorColor : appTheme.primary,
        fontSize: 20,
        fontWeight: "bold",
      }}
    >
      {`${minutes < 10 ? "0" + minutes : minutes}:${
        seconds < 10 ? "0" + seconds : seconds
      }`}
    </Text>
  );
};

export default CountdownTimer2;
