import {
  LockClosedIcon,
  LockOpenIcon,
  MinusCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
type ChecklistControlsProps = {
  locked: boolean;
  handleLockChecklist: (locked: boolean) => void;
};

function ChecklistControls({
  locked,
  handleLockChecklist,
}: ChecklistControlsProps) {
  return (
    <div className="flex justify-end">
      <button
        onClick={() => handleLockChecklist(!locked)}
        className="grid grid-cols-1"
      >
        {locked ? (
          <LockClosedIcon className="size-6 text-slate-700" />
        ) : (
          <LockOpenIcon className="size-6 text-slate-700" />
        )}
      </button>
      <button>
        <MinusCircleIcon className="size-6 text-slate-700" />
      </button>
      <button>
        <CheckCircleIcon className="size-6 text-slate-700" />
      </button>
    </div>
  );
}

export default ChecklistControls;
