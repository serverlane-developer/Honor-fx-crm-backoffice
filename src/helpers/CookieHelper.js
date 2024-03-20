export default class CookieHelper {
  constructor() {
    this.appCookieName = "_oAuto";
    this.preRegisterCookieName = "";
  }

  setCookie = (value, time = null, days = null) => {
    let expires = "";
    let date = new Date();
    if (days) {
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = `; expires=${date.toUTCString()}`;
    } else if (time) {
      date = new Date(time * 1000);
      expires = `; expires=${date.toUTCString()}`;
    }
    value = JSON.stringify(value);
    value = btoa(value);
    document.cookie = `${this.appCookieName}=${value || ""}${expires}; path=/`;
  };

  getCookie = (name = this.appCookieName) => {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i += 1) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return JSON.parse(atob(c.substring(nameEQ.length, c.length)));
    }
    return null;
  };
}
