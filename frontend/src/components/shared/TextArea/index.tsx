import { useEffect, useState } from "react";

import { InputWrapper, FloatingLabel, AlertLabel, Input, CharCount } from "./styles";

// Interface
interface ITextAreaProps {
  type?: string;
  label: string;
  value: string;
  handleValue: (e) => any;
  maxLength?: number;
  mask?: any;
  maskChar?: string | null;
  required?: boolean;
  validate?: (e) => boolean;
  alert?: string;
  obligatoryAlert?: string;
  displayAlert?: boolean;
  children?: React.ReactNode;
  [x: string]: any;
};

export default function TextArea({
  type = "text",
  label,
  value,
  handleValue,
  maxLength = -1,
  mask = null,
  maskChar = null,
  required = false,
  validate = (e) => {
    return true;
  },
  alert = "",
  obligatoryAlert = "Obrigatório",
  displayAlert = !!(alert.length != 0 || required),
  children,
  ...props
}: ITextAreaProps) {
  const [charCount, setCharCount] = useState<number>(0);
  const [focused, setFocused] = useState(value && value.length != 0);
  const [verified, setVerified] = useState<boolean>(false);
  const [empty, setEmpty] = useState<boolean>(true);
  const [valid, setValid] = useState<boolean>(false);

  function handleAndValidate(e) {
    setVerified(true);

    let valueTemp = e.target.value;
    handleValue(valueTemp);
    setCharCount(valueTemp.length);

    let emptyTemp = valueTemp.length == 0;
    setEmpty(emptyTemp);
    setValid(required ? !emptyTemp && validate(valueTemp) : validate(value));
  }

  // Prevent undefined behaviour
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoaded(true);

    if (value) {
      let emptyTemp = value.length == 0;
      setEmpty(emptyTemp);
      setValid(required ? !emptyTemp && validate(value) : validate(value));
    } else {
      setEmpty(true);
      setValid(required ? false && validate(value) : validate(value));
    }
  }, [value]);

  return (
    loaded ?
      <InputWrapper
        verified={
          displayAlert
            ? true
            : required
              ? !empty
              : verified
        }
        valid={valid}
        empty={empty}
        focused={focused || !empty}>
        <Input
          type={type}
          value={value}
          onChange={(e) => handleAndValidate(e)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          maxLength={maxLength}
          {...props} />

        <FloatingLabel>
          {label}
        </FloatingLabel>

        {maxLength !== -1 && (<CharCount>{charCount}/{maxLength}</CharCount>)}

        <AlertLabel>
          {displayAlert
            ? required && empty
              ? obligatoryAlert
              : !valid
                ? alert
                : ""
            : ""}
        </AlertLabel>

        {children}
      </InputWrapper>
      : null
  );
}
