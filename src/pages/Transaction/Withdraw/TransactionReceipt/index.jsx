/* eslint-disable camelcase */
import React, { useEffect, useState } from "react";
import propTypes from "prop-types";
import { FileImageOutlined } from "@ant-design/icons";
import Modal from "antd/es/modal/Modal";
import { Button, Tooltip, message } from "antd";
import { paymentDetails, paymentDetailsPropType } from "./types";
import Endpoints from "../../../../config/apiConstants";
import PgReceipt from "./PgRececipt";
import callApi from "../../../../helpers/NetworkHelper";
import Loader from "../../../../components/Loader";
import { copyBlobToClipboard } from "../../../../helpers/CopyToClipboardHelper";

const TransactionReceipt = ({
  transaction_id,
  pg_task,
  is_receipt_uploaded,
  pg_label,
  payment_status,
  payment_req_method,
  utr_id,
  payment_order_id,
  payment_creation_date,
  account_name,
  amount,
  account_number,
  ifsc,
  panel_id,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  if (!pg_task && !is_receipt_uploaded) return null;

  const onClose = () => setIsVisible(false);
  const onOpen = () => setIsVisible(true);
  return (
    <>
      {isVisible && (
        <Modal title="Transaction Receipt" open={isVisible} onCancel={onClose} footer={null} centered>
          {pg_task ? (
            <PgReceipt
              {...{
                pg_label,
                payment_status,
                payment_req_method,
                utr_id,
                payment_order_id,
                payment_creation_date,
                account_name,
                amount,
                account_number,
                ifsc,
              }}
            />
          ) : (
            <ReceiptImg id={transaction_id} panel_id={panel_id} />
          )}
        </Modal>
      )}
      <Tooltip title="View Receipt">
        <Button icon={<FileImageOutlined />} onClick={onOpen} />
      </Tooltip>
    </>
  );
};
TransactionReceipt.propTypes = {
  transaction_id: propTypes.string.isRequired,
  pg_task: propTypes.bool.isRequired,
  is_receipt_uploaded: propTypes.bool.isRequired,
  panel_id: propTypes.string.isRequired,
  ...paymentDetailsPropType,
};
TransactionReceipt.defaultProps = {
  ...paymentDetails,
};

export const ReceiptImg = ({ id, panel_id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [blob, setBlob] = useState(null);
  const [src, setSrc] = useState(null);

  useEffect(() => {
    const initialise = async () => {
      try {
        setIsLoading(true);
        const endpoint = Endpoints.VIEW_WITHDRAW_TRANSACTION_RECEIPT;
        const url = `${Endpoints.BASE_URL}${endpoint.url(panel_id)}/${id}`;

        const response = await callApi(endpoint.method, url, undefined, undefined, {
          responseType: "blob",
        });

        setBlob(response.data);
      } catch (error) {
        console.error("Error while fetching receipt", error);
      } finally {
        setIsLoading(false);
      }
    };
    initialise();
  }, [id, panel_id]);

  useEffect(() => {
    const onCopy = () => {
      if (!blob) return null;
      copyBlobToClipboard(blob);
      return message.success("Receipt Copied to Clipboard");
    };

    if (blob) {
      setSrc(URL.createObjectURL(blob));
      onCopy();
    } else setSrc(null);
  }, [blob]);

  return isLoading ? (
    <Loader />
  ) : (
    <div>
      {/* <Button type="primary" style={{ margin: "6px 0" }} onClick={onCopy}>
        Copy Image
      </Button> */}
      <div onClick={() => window.open(src)} title="Click to Open Image" onKeyDown={() => {}} role="button" tabIndex={0}>
        {src && <img alt="Receipt" src={src} style={{ width: "100%", margin: "auto", cursor: "pointer" }} />}
      </div>
    </div>
  );
};
ReceiptImg.propTypes = {
  id: propTypes.string.isRequired,
  panel_id: propTypes.string.isRequired,
};

export default TransactionReceipt;
