/* eslint-disable import/prefer-default-export */
import React from "react";
import propTypes from "prop-types";

import LabelValue from "../../../components/LabelValue";
import CopyDetails from "./CopyDetails";
import TransactionReceipt from "./TransactionReceipt";

const TransactionDetails = ({ transaction, canCopy }) => (
  <div>
    <LabelValue label="Amount" value={transaction.amount} />
    <LabelValue label="Source ID:" value={transaction.source_id} />
    <LabelValue label="Username:" value={transaction.username} />
    <LabelValue label="Account Name:" value={transaction.account_name} />
    <LabelValue label="Account Number:" value={transaction.account_number} />
    <LabelValue label="IFSC:" value={transaction.ifsc} />
    <LabelValue label="Date:" value={transaction.date} />
    <LabelValue label="Type:" value={transaction.transaction_type} />
    {canCopy && <CopyDetails {...transaction} />}
  </div>
);
TransactionDetails.propTypes = {
  transaction: propTypes.shape({
    amount: propTypes.string.isRequired,
    source_id: propTypes.string.isRequired,
    username: propTypes.string.isRequired,
    account_name: propTypes.string.isRequired,
    account_number: propTypes.string.isRequired,
    ifsc: propTypes.string.isRequired,
    date: propTypes.string.isRequired,
    transaction_type: propTypes.string.isRequired,
  }).isRequired,
  canCopy: propTypes.bool,
};
TransactionDetails.defaultProps = {
  canCopy: false,
};

const PaymentDetails = ({ transaction, viewReceipt }) => (
  <div>
    <LabelValue label="Payment Gateway:" value={transaction.pg_label} />
    <LabelValue label="PG Nickname:" value={transaction.nickname} />
    <LabelValue label="Pg Order ID:" value={transaction.pg_order_id} />
    <LabelValue label="Payment Status:" value={transaction.payment_status} />
    <LabelValue label="Payment Fail Count:" value={transaction.payment_fail_count} />
    <LabelValue label="Payment Method:" value={transaction.payment_req_method} />
    <LabelValue label="UTR ID:" value={transaction.utr_id} />
    <LabelValue label="Payment Creation Date:" value={transaction.payment_creation_date} />
    <LabelValue label="Payment Order ID:" value={transaction.payment_order_id} />
    <LabelValue label="Pg Task:" value={transaction.pg_task ? "True" : "False"} />
    <LabelValue label="Error Message:" value={transaction.api_error} />
    {viewReceipt && (
      <LabelValue
        label="Receipt: "
        value={transaction.pg_task || transaction.is_receipt_uploaded ? <TransactionReceipt {...transaction} /> : null}
      />
    )}
  </div>
);
PaymentDetails.propTypes = {
  transaction: propTypes.shape({
    pg_label: propTypes.string,
    nickname: propTypes.string,
    pg_order_id: propTypes.string,
    payment_status: propTypes.string,
    payment_fail_count: propTypes.string,
    payment_req_method: propTypes.string,
    utr_id: propTypes.string,
    payment_creation_date: propTypes.string,
    payment_order_id: propTypes.string,
    pg_task: propTypes.bool,
    api_error: propTypes.string,
    is_receipt_uploaded: propTypes.bool,
  }).isRequired,
  panel_id: propTypes.string.isRequired,
  viewReceipt: propTypes.bool,
};
PaymentDetails.defaultProps = {
  viewReceipt: true,
};

export { TransactionDetails, PaymentDetails };
