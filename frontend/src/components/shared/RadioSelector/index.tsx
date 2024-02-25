

// Custom
import {
  Wrapper,
  Group,
  Option
} from "./styles";

// Interface
interface IOption {
  value: any | any[];
  label: string;
}

interface IRadioSelectorProps {
  groupName: string;
  label: string;
  options: IOption[];
  value: any;
  handleValue: (e) => any;
};

export default function RadioSelector({
  groupName,
  label,
  options,
  value,
  handleValue
}: IRadioSelectorProps) {
  function onChange(e) {
    handleValue(e.target.value);
  }

  return (
    <Wrapper>
      <label>{label}</label>

      <Group>
        <div>
          {options.map((option, index) =>
            <Option key={index}>
              <input
                type={"radio"}
                id={`${groupName}-option-${index}`}
                name={groupName}
                value={option.value}
                onChange={(e) => onChange(e)}
                checked={option.value == value}

                className={"btn-check"}
              />
              <label htmlFor={`${groupName}-option-${index}`}>{option.label}</label>
            </Option>
          )}
        </div>
      </Group>
    </Wrapper>
  );
}