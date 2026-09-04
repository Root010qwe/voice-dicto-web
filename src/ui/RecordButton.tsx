interface Props {
  isRecording: boolean;
  disabled: boolean;
  onClick: () => void;
}

export function RecordButton({ isRecording, disabled, onClick }: Props) {
  return (
    <button
      type="button"
      className={`record-button${isRecording ? " record-button--active" : ""}`}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={isRecording}
    >
      <span className="record-button__dot" />
      {isRecording ? "Остановить" : "Начать запись"}
    </button>
  );
}
