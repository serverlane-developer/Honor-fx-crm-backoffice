export default (err) => {
  const message = err?.response?.data?.message || err?.data?.message || err?.message || err;
  return message.length > 200 ? (message || "").slice(0, 200) : message;
};
