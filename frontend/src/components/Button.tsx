import { useState } from "react";
import { sendCommand } from "../utils/helper";

export const Button = ({
  property,
  text,
  icon,
  action,
}: {
  property: string;
  text: string | null;
  icon: boolean;
  action: string | null;
}) => {
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive(!isActive);
    if (property === "volume" && action === "mute") {
      sendCommand(`/${property}`, { action: "mute" });
    } else if (property === "fullscreen") {
      sendCommand(`/${property}`, { action: isActive ? "on" : "off" });
    } else if (property === "backwards" || property === "forwards") {
      sendCommand(`/skip`, {
        action: property === "forwards" ? "forwards" : "backwards",
      });
    } else {
      sendCommand(`/${property}`, {});
    }
  };

  return (
    <button
      onClick={handleClick}
      className="size-16 bg-[#2f3642] rounded-3xl flex justify-center items-center py-2"
    >
      {icon && (
        <img
          src={`/icons/${property}${
            (property === "volume" ||
              property === "fullscreen" ||
              property === "pause") &&
            isActive
              ? "-active"
              : ""
          }.png`}
          className="size-5"
        />
      )}
      {text && <h1 className="font-bold text-sm">{text.toUpperCase()}</h1>}
    </button>
  );
};
