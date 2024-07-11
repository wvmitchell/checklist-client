import {
  LockClosedIcon,
  LockOpenIcon,
  MinusCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

type ChecklistControlsProps = {
  locked: boolean;
  handleLockChecklist: (locked: boolean) => void;
  handleToggleAll: (toggle: boolean) => void;
};

function ChecklistControls({
  locked,
  handleLockChecklist,
  handleToggleAll,
}: ChecklistControlsProps) {
  return (
    <div className="flex justify-end">
      <button onClick={() => handleLockChecklist(!locked)}>
        {locked ? (
          <LockClosedIcon className="size-6 text-slate-700" />
        ) : (
          <LockOpenIcon className="size-6 text-slate-700" />
        )}
      </button>
      <button onClick={() => handleToggleAll(false)}>
        <MinusCircleIcon className="size-6 text-slate-700" />
      </button>
      <button onClick={() => handleToggleAll(true)}>
        <CheckCircleIcon className="size-6 text-slate-700" />
      </button>
    </div>
  );
}

export default ChecklistControls;
