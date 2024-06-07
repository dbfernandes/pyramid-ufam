
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { tick } from "redux/slicer/timer";

// Shared
import { checkAuthentication } from "utils";

export default function SessionWatcher() {
  const dispatch = useDispatch();

  useEffect(() => {
    checkAuthentication();
    const intervalId = setInterval(() => {
      dispatch(tick());
      checkAuthentication();
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <></>
  );
}