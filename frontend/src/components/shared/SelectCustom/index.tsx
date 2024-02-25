import { useState, useEffect } from "react";

// Shared
import Spinner from "components/shared/Spinner";

// Custom
import {
  InputWrapper,
  SelectStyled,
  FloatingLabel,
  AlertLabel,
  SpinnerWrapper
} from "./styles";

// Interface
interface IOption {
  value: any | any[];
  label: string;
}

interface ISelectCustomProps {
  label: string;
  options: IOption[];
  value: any;
  handleValue: (e) => any;
  required?: boolean;
  obligatoryAlert?: string;
  displayAlert?: boolean;
  children?: React.ReactNode;
  fetching?: boolean;
  noOptionsMessage?: string;
  isMulti?: boolean;
  [x: string]: any;
};

export default function SelectCustom({
  label,
  options,
  value,
  handleValue,
  required = false,
  obligatoryAlert = "Obrigatório",
  displayAlert = !!(alert.length != 0 || required),
  children,
  fetching = false,
  noOptionsMessage = "Nenhum item encontrado",
  isMulti = false,
  ...props
}: ISelectCustomProps) {
  const [focused, setFocused] = useState(false);
  const [empty, setEmpty] = useState(true);

  function handleSingle(e) {
    let valueTemp = e.value;

    handleValue(valueTemp);
    setEmpty(false);
  }

  function handleMulti(e) {
    let valueTemp = e.map((e) => e.value);

    handleValue(valueTemp);
    setEmpty(false);
  }

  // Prevent undefined behaviour
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoaded(true);

    if (value) {
      let emptyTemp = value.length == 0;
      setEmpty(emptyTemp);
    } else {
      setEmpty(true);
    }
  }, [value]);

  return (
    loaded
      ? <InputWrapper
        verified={
          displayAlert
            ? true
            : required
              ? !empty
              : true
        }
        valid={!empty}
        empty={empty}
        focused={focused || !empty}>
        <SelectStyled
          placeholder={""}
          options={options}
          onChange={(e) => isMulti ? handleMulti(e) : handleSingle(e)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          fetching={fetching}
          noOptionsMessage={() => fetching
            ? <SpinnerWrapper><Spinner size={"20px"} color={"var(--muted)"} /></SpinnerWrapper>
            : <>{noOptionsMessage}</>
          }
          isMulti={isMulti}
          {...props}
        />

        <FloatingLabel>{label}</FloatingLabel>
        <AlertLabel>
          {displayAlert
            ? required && empty
              ? obligatoryAlert
              : ""
            : ""}
        </AlertLabel>

        {children}
      </InputWrapper>
      : null
  );
}