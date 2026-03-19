import { useEffect, useState } from "react";

export default function Countdown({ endDate }) {
  const calculateTime = () => {
    const now = Date.now();
    const distance = new Date(endDate) - now;

    if (distance <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((distance / (1000 * 60)) % 60),
      seconds: Math.floor((distance / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTime());
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  const Box = ({ label, value }) => (
    <div className="text-center">
      <p className="text-sm ">{label}</p>
      <p className="text-3xl font-bold">
        {String(value).padStart(2, "0")}
      </p>
    </div>
  );

  const Colon = () => (
    <span className="text-red-500 text-3xl font-bold pb-2">:</span>
  );

  return (
    <div className="flex items-end gap-4 p-4 rounded">
      <Box label="Days" value={timeLeft.days} />
      <Colon />
      <Box label="Hours" value={timeLeft.hours} />
      <Colon />
      <Box label="Minutes" value={timeLeft.minutes} />
      <Colon />
      <Box label="Seconds" value={timeLeft.seconds} />
    </div>
  );
}