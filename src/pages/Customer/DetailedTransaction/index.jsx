import React, { useEffect, useState } from "react";
import propTypes from "prop-types";
import lo from "lodash";
import Endpoints from "../../../config/apiConstants";
import callApi from "../../../helpers/NetworkHelper";
import getAxiosError from "../../../helpers/getAxiosError";
import Loader from "../../../components/Loader";
import ErrorMessage from "../../../components/ErrorMessage";
import Description from "../../../components/Description";

const DetailedTransaction = ({ customer_id, transaction_type, transaction_id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [transaction, setTransactions] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const getTransactionDetails = async () => {
    try {
      setIsLoading(true);
      const url = `${Endpoints.BASE_URL}${Endpoints.GET_CUSTOMER_TRANSACTION_DETAILED.url(
        customer_id,
        transaction_type,
        transaction_id
      )}`;
      let res = await callApi("get", url);
      res = res?.data?.data?.transaction;
      setTransactions(res);
    } catch (err) {
      const message = getAxiosError(err);
      console.error("Error getting Transaction Details", message, err);
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTransactionDetails();
  }, []);

  if (isLoading) return <Loader message="Loading Detailed Transaction" />;

  if (errorMessage) {
    return (
      <div style={{ padding: "150px 0", minHeight: 300, maxHeight: "80vh", overflow: "auto" }}>
        <ErrorMessage message={errorMessage} />
      </div>
    );
  }

  if (!transaction) return <div style={{ padding: 50, textAlign: "center" }}>Transaction Not Found</div>;

  return (
    <div>
      <Description items={lo.pick(transaction, Object.keys(transaction).sort())} title="Detailed Transaction" />
    </div>
  );
};
DetailedTransaction.propTypes = {
  customer_id: propTypes.string.isRequired,
  transaction_type: propTypes.string.isRequired,
  transaction_id: propTypes.string.isRequired,
};
export default DetailedTransaction;
