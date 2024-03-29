const Endpoints = {
  BASE_URL: process.env.REACT_APP_BASE_URL,
  // auth
  LOGIN: { url: "/admin/auth/signin", method: "POST" },
  VERIFY_OTP: { url: "/admin/auth/verify-otp", method: "POST" },
  SIGNOUT: { url: "/admin/auth/signout", method: "POST" },
  ADMIN_FORGOT_PASSWORD: { url: "/admin/auth/forgot-password", method: "POST" },
  ADMIN_RESET_PASSWORD: { url: "/admin/auth/reset-password", method: "PUT" },
  ADMIN_UPDATE_PASSWORD: { url: "/admin/auth/update-password", method: "PUT" },
  ADMIN_TOGGLE_2FA_STATUS: { url: "/admin/auth/toggle-2fa", method: "POST" },
  ADMIN_CONFIRM_2FA_STATUS: { url: "/admin/auth/confirm-2fa", method: "PUT" },

  // self
  ADMIN_GET_2FA_STATUS: { url: "/admin/self/2fa-status", method: "GET" },
  PROFILE: { url: "/admin/self/profile", method: "GET" },
  ADMIN_LOGIN_HISTORY: { url: "/admin/self/login-history", method: "GET" },

  // Module
  CREATE_MODULE: { url: "/modules/module", method: "POST" },
  GET_MODULES: { url: "/modules/module", method: "GET" },
  GET_MODULE_BY_ID: { url: "/modules/module", method: "GET" },
  UPDATE_MODULE: { url: "/modules/module", method: "PUT" },
  DELETE_MODULE: { url: "/modules/module", method: "DELETE" },

  // Submodule
  CREATE_SUBMODULE: { url: "/modules/submodule", method: "POST" },
  GET_MODULES_FOR_DROPDOWN: {
    url: "/modules/submodule/modules-dropdown",
    method: "GET",
  },
  GET_SUBMODULES_FOR_MODULE: { url: "/modules/submodule", method: "GET" },
  GET_SUBMODULES_FOR_ROLE_ASSIGNMENT: {
    url: "/modules/submodule/for-assignment",
    method: "GET",
  },
  GET_SUBMODULE_BY_ID: { url: "/modules/submodule", method: "GET" },
  UPDATE_SUBMODULE: { url: "/modules/submodule", method: "PUT" },
  DELETE_SUBMODULE: { url: "/modules/submodule", method: "DELETE" },

  // ROLE
  CREATE_ROLE: { url: "/roles/role", method: "Post" },
  UPDATE_ROLE: { url: "/roles/role", method: "PUT" },
  GET_ROLE_BY_ID: { url: "/roles/role", method: "GET" },
  GET_ROLES: { url: "/roles/role", method: "GET" },
  DELETE_ROLES: { url: "/roles/role", method: "DELETE" },

  // ADMIN
  CREATE_ADMIN: { url: "/admin/user", method: "Post" },
  UPDATE_ADMIN: { url: "/admin/user", method: "PUT" },
  GET_ADMIN_BY_ID: { url: "/admin/user", method: "GET" },
  GET_ADMINS: { url: "/admin/user", method: "GET" },
  GET_ROLES_FOR_ADMIN_CREATION: { url: "/admin/user/roles", method: "GET" },
  DELETE_ADMIN: { url: "/admin/user", method: "DELETE" },

  // WITHDRAW
  GET_PANELS_FOR_WITHDRAW_TRANSACTION: {
    url: "/transaction/withdraw/panels",
    method: "GET",
  },
  GET_WITHDRAW_TRANSACTION_BY_ID: {
    url: `/transaction/withdraw`,
    method: "GET",
  }, // params /:transaction_id
  GET_WITHDRAW_TRANSACTIONS_BY_STATUS: {
    url: `/transaction/withdraw`,
    method: "GET",
  }, // params /:status
  UPDATE_WITHDRAW_TRANSACTION_STATUS: {
    url: `/transaction/withdraw/status`,
    method: "PUT",
  }, // params /:transaction_id
  RETRY_WITHDRAW_TRANSACTION_ON_RPA: {
    url: `/transaction/withdraw/retry/rpa`,
    method: "POST",
  }, // params /:transaction_id
  RETRY_WITHDRAW_TRANSACTION_ON_PAYOUT: {
    url: `/transaction/withdraw/retry/payout`,
    method: "POST",
  }, // params /:transaction_id
  REFRESH_PAYMENT_STATUS: {
    url: `/transaction/withdraw/payout-status`,
    method: "PUT",
  }, // params /:pg_order_id
  REFRESH_MULTIPLE_PAYMENT_STATUS: {
    url: `/transaction/withdraw/payout-status`,
    method: "PUT",
  }, // body { pg_rder_ids: pg_order_id[] }
  REFRESH_PG_WITHDRAW_TRANSACTION_STATUS: {
    url: `/transaction/withdraw/pg-transaction-status`,
    method: "PUT",
  }, // params /:pg_order_id
  GET_WITHDRAW_TRANSACTION_HISTORY_BY_ID: {
    url: `/transaction/withdraw/history`,
    method: "GET",
  }, // params /:transaction_id
  GET_PAYMENT_HISTORY: {
    url: `/transaction/withdraw/payment-history`,
    method: "GET",
  }, // params /:transaction_id
  VIEW_WITHDRAW_TRANSACTION_RECEIPT: {
    url: `/transaction/withdraw/receipt`,
    method: "GET",
  }, // params /:transaction_id
  REFUND_WITHDRAW_TRANSACTION: {
    url: `/transaction/withdraw/refund`,
    method: "POST",
  }, // params /:transaction_id

  // DEPOSIT
  GET_PANELS_FOR_DEPOSIT_TRANSACTION: {
    url: "/transaction/deposit/panels",
    method: "GET",
  },
  GET_DEPOSIT_TRANSACTION_BY_ID: {
    url: `/transaction/deposit`,
    method: "GET",
  }, // params /:transaction_id
  GET_DEPOSIT_TRANSACTIONS_BY_STATUS: {
    url: `/transaction/deposit`,
    method: "GET",
  }, // params /:status
  UPDATE_DEPOSIT_TRANSACTION_STATUS: {
    url: `/transaction/deposit/status`,
    method: "PUT",
  }, // params /:transaction_id
  RETRY_DEPOSIT_TRANSACTION_ON_RPA: {
    url: `/transaction/deposit/retry/rpa`,
    method: "POST",
  }, // params /:transaction_id
  GET_DEPOSIT_TRANSACTION_HISTORY_BY_ID: {
    url: `/transaction/deposit/history`,
    method: "GET",
  }, // params /:transaction_id
  VERIFY_DEPOSIT_TRANSACTION: {
    url: `/transaction/deposit/verify`,
    method: "POST",
  },
  SHOW_CSV_STATEMENT: {
    url: `/transaction/deposit/csv-statement`,
    method: "GET",
  },

  // PAYOUT GATEWAY
  CREATE_PAYOUT_GATEWAY: { url: "/paymentGateway/payout", method: "POST" },
  UPDATE_PAYOUT_GATEWAY: { url: "/paymentGateway/payout", method: "PUT" },
  GET_PAYOUT_GATEWAY_BY_ID: { url: "/paymentGateway/payout", method: "GET" }, // :pg_id
  GET_PAYOUT_GATEWAYS: { url: "/paymentGateway/payout", method: "GET" },
  DELETE_PAYOUT_GATEWAY: { url: "/paymentGateway/payout", method: "DELETE" },
  GET_PAYOUT_GATEWAY_BALANCE: { url: "/paymentGateway/payout/balance", method: "GET" }, // :pg_id

  // PAYIN GATEWAY
  CREATE_PAYIN_GATEWAY: { url: "/paymentGateway/payin", method: "POST" },
  UPDATE_PAYIN_GATEWAY: { url: "/paymentGateway/payin", method: "PUT" },
  GET_PAYIN_GATEWAY_BY_ID: { url: "/paymentGateway/payin", method: "GET" }, // :pg_id
  GET_PAYIN_GATEWAYS: { url: "/paymentGateway/payin", method: "GET" },
  DELETE_PAYIN_GATEWAY: { url: "/paymentGateway/payin", method: "DELETE" },

  // USER
  GET_USERS: { url: "/users/management", method: "GET" },
  GET_USER_BY_ID: { url: "/users/management", method: "GET" },
  GET_USER_TRANSACTIONS: {
    url: (customer_id) => `/users/management/${customer_id}/transactions`,
    method: "GET",
  },
  GET_USER_TRANSACTION_DETAILED: {
    url: (customer_id, transaction_type, transaction_id) =>
      `/users/management/${customer_id}/transaction/${transaction_type}/${transaction_id}`,
    method: "GET",
  },
  GET_USER_LOGIN_HISTORY: {
    url: (customer_id) => `/users/management/${customer_id}/login-history`,
    method: "GET",
  },
  GET_USER_MT5_USER_LIST: {
    url: (customer_id) => `/users/management/${customer_id}/mt5-users`,
    method: "GET",
  },

  // REFERRAL
  GET_REFERRAL_CODE: { url: "/referral/management/code", method: "GET" }, // Optional GET /:user_id to view other user's code
  GET_REFERRAL_LIST: { url: "/referral/management/list", method: "GET" },
  GET_CUSTOMER_LIST_BY_REFERRAL_ID: { url: "/referral/management/customers", method: "GET" }, // :referral_id
  UPDATE_REFERRAL_CODE: { url: "/referral/management/code", method: "PUT" }, // Optional PUT /:user_id to update other user's code
};

export default Endpoints;
