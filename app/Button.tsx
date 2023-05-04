"use Client";

interface IButtonProps {
  children: string;
  type: "reset" | "action";
  disabled?: boolean;
  handleClick: () => void;
}

// active, disabled, selected, hover
export default function Button({
  children,
  type,
  disabled,
  handleClick,
}: IButtonProps) {
  const ResetButton = (
    <button
      onClick={() => handleClick()}
      className="bg-prpl-row px-1 text-grey-light hover:opacity-50"
    >
      {children}
    </button>
  );
  const ActionButton = (
    <button
      onClick={disabled ? () => {} : () => handleClick()}
      className={
        disabled
          ? "bg-btn-grn/50 px-1 text-prpl-dark cursor-not-allowed"
          : "bg-btn-grn px-1 text-prpl-dark hover:opacity-50"
      }
    >
      {children}
    </button>
  );

  return <>{type === "reset" ? ResetButton : ActionButton}</>;
}
