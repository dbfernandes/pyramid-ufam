import axios, { AxiosRequestConfig } from "axios";
import { store } from "redux/store";
import { authorize, logout } from "redux/slicer/user";

// Shared
import toast from "components/shared/Toast";

export function checkAuthentication(): boolean {
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

  let authorized = false;
  async function authenticate(refreshToken: string) {
    const options = {
      url: `${process.env.api}/auth/refreshToken`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        refreshToken,
      },
    };

    await axios
      .request(options as AxiosRequestConfig)
      .then((response) => {
        authorized = true;
        store.dispatch(
          authorize({
            token: response.headers["authorization"],
            refreshToken: response.headers["refresh_token"],
          })
        );
      })
      .catch((error) => {
        authorized = false;
        toast("Erro", "Houve um erro ao renovar sua sessão.", "danger");
      });
  }

  function kick() {
    authorized = false;
    store.dispatch(logout());
  }

  const { user } = store.getState();
  if (user.token && user.refreshToken) {
    const currentTime = new Date();

    const token = new Date(parseJwt(user.token).exp * 1000);
    const tokenExpired = currentTime >= token;

    const refreshToken = new Date(parseJwt(user.refreshToken).exp * 1000);
    const refreshTokenExpired = currentTime >= refreshToken;

    if (refreshTokenExpired) {
      kick();
    } else if (tokenExpired) {
      authenticate(user.refreshToken);
    } else {
      authorized = true;
    }
  }

  return authorized;
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
  if (cpf.length === 0) return true;

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