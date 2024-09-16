import { ColoredBar, SubmissionStatusStyled } from "../styles";

export default function SubmissionStatus({ status }) {
  const statusBars = {
    1: {
      text: "Pendente",
      bars: ["g", "w", "w"],
    },
    2: {
      text: "Pré-aprovado",
      bars: ["g", "g", "w"],
    },
    3: {
      text: "Aprovado",
      bars: ["g", "g", "g"],
    },
    4: {
      text: "Rejeitado",
      bars: ["g", "r", "r"],
    },
    5: {
      text: "Cancelado",
      bars: ["r", "w", "w"],
    },
  };

  return (
    <SubmissionStatusStyled>
      <p>{statusBars[status].text}</p>

      <div>
        {statusBars[status].bars.map((bar, index) => (
          <ColoredBar key={index} color={bar} />
        ))}
      </div>
    </SubmissionStatusStyled>
  );
}