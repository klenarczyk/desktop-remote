import { sendCommand } from "../utils/helper";

export const Shortcut = ({ app }: { app: string }) => {
  const handleClick = () => {
    sendCommand("/shortcut", { app: `${app}` });
  };

  return (
    <button
      onClick={handleClick}
      className="size-16 bg-[#2f3642] rounded-3xl flex justify-center items-center py-2"
    >
      <img src={`/icons/${app}.png`} className="w-11" />
    </button>
  );
};
