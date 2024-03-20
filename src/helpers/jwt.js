import CookieHelper from "./CookieHelper";

const handleJwt = (data) => {
  if (!data?.token) throw new Error("Token not found");
  const cookieHelper = new CookieHelper();

  const accessRights = data?.access_rights;
  let modules = [];

  if (accessRights?.length > 0) {
    modules = Array.from(
      new Set(
        accessRights.map((x) =>
          String(x?.module_name || "")
            .replace(/ /g, "")
            .toLowerCase()
        )
      )
    );
    data.modules = modules;
  }
  cookieHelper.setCookie(data, null, 1);
};

export default { handleJwt };
