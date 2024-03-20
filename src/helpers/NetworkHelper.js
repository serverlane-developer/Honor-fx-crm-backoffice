import axios from "axios";
import CookieHelper from "./CookieHelper";

async function callApi(
  method = "POST",
  url,
  data = {},
  headers = { "Content-type": "application/json" },
  options = {}
) {
  // console.log("network info", method, url, data);
  const cookieHelper = new CookieHelper();
  const userData = cookieHelper.getCookie();

  if (userData && userData.token) {
    headers = {
      ...headers,
      "x-access-token": `Bearer ${userData.token}`,
    };
  }
  return new Promise((resolve, reject) => {
    axios({
      method,
      url,
      data,
      headers,
      ...options,
    })
      .then((res) => resolve(res))
      .catch((err) => {
        // console.log("err:",err.response);
        if (err.response && err.response.status === 403) {
          // delete cookie if 401 response code found
          cookieHelper.setCookie("", null, -365);
          window.location.reload();
        }
        reject(err);
      });
  });
}

export default callApi;
