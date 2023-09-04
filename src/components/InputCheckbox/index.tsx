import classNames from "classnames"
import { useRef, useState } from "react"
import { InputCheckboxComponent } from "./types"

export const InputCheckbox: InputCheckboxComponent = ({ id, checked: initialChecked = false, disabled, onChange }) => {
  const { current: inputId } = useRef(`RampInputCheckbox-${id}`)
  const [checked, setChecked] = useState(initialChecked); // Local state

  // Update both local state and inform parent through callback
  const toggleCheckbox = () => {
    const newCheckedStatus = !checked;
    setChecked(newCheckedStatus);
    onChange(newCheckedStatus);
  };

  return (
    <div className="RampInputCheckbox--container" data-testid={inputId}>
      <label
        htmlFor={inputId} // Associate label with input
        className={classNames("RampInputCheckbox--label", {
          "RampInputCheckbox--label-checked": checked,
          "RampInputCheckbox--label-disabled": disabled,
        })}
      />
      <input
        id={inputId}
        type="checkbox"
        className="RampInputCheckbox--input"
        checked={checked}
        disabled={disabled}
        onChange={toggleCheckbox}
      />
    </div>
  )
}
