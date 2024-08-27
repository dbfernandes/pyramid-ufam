
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { tick } from "redux/slicer/timer";

// Shared
import { checkAuthentication } from "utils";

export default function SessionWatcher() {
  // Konami code
  const [konami, setKonami] = useState<boolean>(false);
  let key = 0;
  const code = [38, 38, 40, 40, 37, 39, 37, 39, 65, 66];

  function handleKonami(e) {
    if (e.keyCode == code[key]) {
      key++;

      if (key == code.length) {
        setKonami(true);
      }
    } else {
      key = 0;
    }
  }

  const dispatch = useDispatch();

  useEffect(() => {
    document.addEventListener("keydown", handleKonami);

    checkAuthentication();
    const intervalId = setInterval(() => {
      dispatch(tick());
      checkAuthentication();
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (konami) {
      window.alert("Eu honestamente não sabia se alguém ia encontrar isso mas é, se tu sabia que eu trabalhei aqui, dava pra adivinhar eu acho. AH eu também queria agradecer a Nicolly Alves e o professor David Fernandes. AH É, também botei meu portfólio aqui: https://guilherme.vercel.app/, mas ele vai abrir automaticamente agora.");
      window.alert("Eu acho?");
      window.open("https://guilherme.vercel.app/", "_blank");

      setKonami(false);
      key = 0;
    }
  }, [konami]);

  return (
    <></>
  );
}