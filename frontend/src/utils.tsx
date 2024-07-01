import axios, { AxiosRequestConfig } from "axios";
import { store } from "redux/store";
import { authorize, logout } from "redux/slicer/user";
import { resetTimer } from "redux/slicer/timer";

// Shared
import { toast } from "react-toastify";

export async function checkAuthentication(): Promise<void> {
  function parseJwt(token) {
    let base64Url = token.split(".")[1];
    let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    let jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  }

  async function authenticate(refreshToken: string) {
    const options = {
      url: `${process.env.api}/auth/refresh-token`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Request-Headers": "x-access-token, x-refresh-token",
        "Refresh": refreshToken
      },
    };

    await axios
      .request(options as AxiosRequestConfig)
      .then((response) => {
        store.dispatch(
          authorize({
            token: response.headers["x-access-token"],
            refreshToken: response.headers["x-refresh-token"],
          })
        );
      })
      .catch((error) => {
        if (error?.response?.status === 401) {
          toast.error("Houve um erro ao renovar sua sessão.");
          store.dispatch(logout());
        } else {
          toast.error("Houve um erro ao renovar sua sessão.");
        }
      });
  }

  const refreshToken = getRefreshToken();
  const { timer } = store.getState();

  if (refreshToken) {
    const currentTime = new Date();

    // Check if token is expired or about to expire
    const tokenExpired = timer.time === 60 || currentTime >= new Date(parseJwt(getToken()).exp * 1000);

    // Check if refresh token is expired
    const refreshTokenExpired = currentTime >= new Date(parseJwt(refreshToken).exp * 1000);

    if (refreshTokenExpired) {
      store.dispatch(logout());
    } else if (tokenExpired) {
      resetTimer();
      await authenticate(refreshToken);
    }
  } else {
    // If refresh token is expired, kick user
    store.dispatch(logout());
  }
}

export function getToken() {
  const { user } = store.getState();
  return user.token;
}

export function getRefreshToken() {
  const { user } = store.getState();
  return user.refreshToken;
}

export function getPlural(word: string) {
  word = word.toLowerCase();
  return word.slice(0, -1) + "as";
}

export function getFilename(file: string): string {
  const result = file.split(/-(.+)?/, 2).pop();
  return result !== undefined ? result : "";
}

export function getFirstName(name: string) {
  return name.split(" ")[0];
}

export function getFirstAndLastName(name: string) {
  const _name = name.split(" ");
  if (_name.length > 1) return `${_name[0]} ${_name.pop()}`;

  return name;
}

export function validateCpf(cpf) {
  if (cpf == null || cpf.length === 0) return true;

  const numericCpf = cpf.replace(/\D/g, "");
  if (numericCpf.length !== 11) {
    return false;
  }

  // Checksum
  const calculateChecksum = (slice) => {
    const length = slice.length;

    let checksum = 0;
    let pos = length + 1;

    for (let i = 0; i < length; i++) {
      checksum += slice.charAt(i) * pos--;

      if (pos < 2) pos = 9;
    }

    return checksum % 11 < 2 ? 0 : 11 - (checksum % 11);
  };

  const firstDigit = calculateChecksum(numericCpf.slice(0, 9));
  const secondDigit = calculateChecksum(numericCpf.slice(0, 10));

  return (
    parseInt(numericCpf.charAt(9)) === firstDigit &&
    parseInt(numericCpf.charAt(10)) === secondDigit
  );
}

export function validateEmail(email: string) {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}

export function formatCpf(cpf: string) {
  return cpf.replace(
    /(\d{3})(\d{3})(\d{3})(\d{2})/,
    "$1.$2.$3-$4"
  );
}

export function slugify(text: string) {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}

export function getImage(file: string) {
  function getImageOrFallback(url, fallback) {
    return new Promise((resolve, reject) => {
      if (url && url !== null) {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve(url);
        img.onerror = () => resolve(fallback);
      } else {
        resolve(fallback);
      }
    }).catch(() => {
      return fallback;
    });
  }

  const defaultImg = `${process.env.img}/user.png`;
  return getImageOrFallback(file, defaultImg);
}

export function parseDate(date: string) {
  const dateArr = date.split("T")[0].split("-");
  return `${dateArr[2]}/${dateArr[1]}/${dateArr[0]}`;
}

export function parseDateAndTime(date: string) {
  const dateArr = date.split("T")[0].split("-");
  const timeArr = date.split("T")[1].split(":");
  return `${dateArr[2]}/${dateArr[1]}/${dateArr[0]} às ${timeArr[0]}:${timeArr[1]}`;
}

export function range(start: number, end: number) {
  let ans = [];
  for (let i = start; i <= end; i++) {
    ans.push(i as never);
  }
  return ans;
}

export function parseUserActiveParam(status: string) {
  const statusArray = status.split("-");

  if (statusArray.length > 1) return "";
  else return `&active=${status == '1'}`;
}