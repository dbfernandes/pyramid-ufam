
import RangeSlider from "react-bootstrap-range-slider";

// Custom
import {
  Wrapper,
  CustomInputWrapper
} from "./styles";

// Interfaces
interface IRangeInputProps {
  value: number;
  handleValue: (e) => any;
  min?: number;
  max?: number;
  disabled?: boolean;
}

export default function RangeInput({
  value,
  handleValue,
  min = 1,
  max = 1,
  disabled = false
}) {
  function handle(e) {
    let valueTemp = parseInt(e.target.value);

    if (valueTemp < min) {
      valueTemp = min;
    } else if (valueTemp > max) {
      valueTemp = max;
    }

    handleValue(valueTemp);
  }

  return (
    <Wrapper>
      <RangeSlider
        value={value}
        onChange={e => handle(e)}
        min={min}
        max={max}
        disabled={disabled}
        tooltip="off"
      />

      <CustomInputWrapper>
        <input
          type="number"
          value={value}
          onChange={e => handle(e)}
        />
        <span>/ {max}h</span>
      </CustomInputWrapper>
    </Wrapper>
  )
}
