import propTypes from "prop-types";

const paymentDetails = {
  pg_label: "",
  payment_status: "",
  utr_id: "",
  payment_order_id: "",
  payment_creation_date: "",
  payment_req_method: "",
  account_name: "",
  amount: "",
  account_number: "",
  ifsc: "",
};

const paymentDetailsPropType = {
  pg_label: propTypes.string,
  payment_status: propTypes.string,
  utr_id: propTypes.string,
  payment_order_id: propTypes.string,
  payment_creation_date: propTypes.string,
  payment_req_method: propTypes.string,
  account_name: propTypes.string,
  amount: propTypes.string,
  account_number: propTypes.string,
  ifsc: propTypes.string,
};

export { paymentDetails, paymentDetailsPropType };
