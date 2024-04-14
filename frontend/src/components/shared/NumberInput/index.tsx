

import {
  Wrapper,
  ValueWrapper
} from "./styles";

// Interface
interface INumberInputProps {
  label: string;
  value: number;
  handleValue: (e) => any;
  min?: number;
  max?: number | null;
  step?: number;
};

export default function NumberInput({
  label,
  value,
  handleValue,
  min = 0,
  max = null,
  step = 1
}: INumberInputProps) {
  function decrease(e) {
    e.preventDefault();

    if (value > min) {
      handleValue(value - step);
    }
  }

  function increase(e) {
    e.preventDefault();

    if (max == null || (max && value < max)) {
      handleValue(value + step);
    }
  }

  return (
    <Wrapper>
      <label>{label}</label>

      <ValueWrapper>
        <button
          onClick={(e) => decrease(e)}
          disabled={value == min}>
          <i className="fas fa-minus" />
        </button>

        <p>{value}</p>

        <button
          onClick={(e) => increase(e)}
          disabled={value == max}>
          <i className="fas fa-plus" />
        </button>
      </ValueWrapper>
    </Wrapper>
  );
}