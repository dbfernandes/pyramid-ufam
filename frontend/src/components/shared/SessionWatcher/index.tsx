
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { tick } from "redux/slicer/timer";

// Shared
import { checkAuthentication } from "utils";

// Interfaces
import IUserLogged from "interfaces/IUserLogged";
import { IRootState } from "redux/store";

export default function SessionWatcher() {
  const dispatch = useDispatch();
  const timer = useSelector<IRootState, IUserLogged>(state => state.user);

  useEffect(() => {
    const intervalId = setInterval(() => {
      dispatch(tick());
      checkAuthentication();
    }, 10000);

    return () => clearInterval(intervalId);
  }, [timer]);

  return (
    <></>
  );
}