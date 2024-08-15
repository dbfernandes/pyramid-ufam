import { useState, useEffect } from "react";
import { checkPasswordStrength } from "utils";

// Custom
import {
  ColoredBar,
  PasswordStrengthCheck,
  PasswordStrengthMainCheck,
  PasswordStrengthDescription,
  PasswordStrengthWrapper,
} from "./styles";

// Interfaces
interface IPasswordStrengthProps {
  password: string;
  showPasswordStrengthDescription?: boolean;
}

export default function PasswordStrength({ password, showPasswordStrengthDescription = false }: IPasswordStrengthProps) {
  const [strength, setStrength] = useState<any>(null);
  useEffect(() => {
    const _strength = checkPasswordStrength(password);
    console.log(_strength);
    setStrength(_strength);
  }, [password]);

  const labels = [
    {
      label: "Muito fraca",
      color: "darkred"
    },
    {
      label: "Fraca",
      color: "var(--danger)"
    },
    {
      label: "Média",
      color: "var(--warning)"
    },
    {
      label: "Forte",
      color: "var(--primary-color)"
    },
    {
      label: "Muito forte",
      color: "var(--success)"
    }
  ];

  const checks = [
    {
      label: "Mínimo de 8 caracteres",
      check: strength?.checks.length
    },
    {
      label: "Pelo menos uma letra minúscula",
      check: strength?.checks.lowercase
    },
    {
      label: "Pelo menos uma letra maiúscula",
      check: strength?.checks.uppercase
    },
    {
      label: "Pelo menos um número",
      check: strength?.checks.number
    },
    {
      label: <>Pelo menos um caractere especial ({`!@#$%^&*(),.?":{}|<>`})</>,
      check: strength?.checks.special
    }
  ];

  return (
    <PasswordStrengthWrapper>
      {strength?.score ? <ColoredBar color={labels[strength?.score - 1].color} /> : null}

      {showPasswordStrengthDescription && (
        <PasswordStrengthDescription>
          <PasswordStrengthMainCheck check={strength?.score >= 4}>
            <i className={`bi bi-${strength?.score >= 4 ? "check-circle-fill" : "circle"}`} />
            A senha precisa ter pelo menos <b>4</b> dos critérios abaixo.
          </PasswordStrengthMainCheck>

          {checks.map(({ label, check }, index) => (
            <PasswordStrengthCheck key={index} check={check}>
              <i className={`bi bi-${check ? "check-circle-fill" : "circle"}`} />{label}
            </PasswordStrengthCheck>
          ))}
        </PasswordStrengthDescription>
      )}
    </PasswordStrengthWrapper>
  );
}