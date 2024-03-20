import React, { useState } from "react";
import propTypes from "prop-types";
import lo from "lodash";
import { Button, Col, Modal } from "antd";
import DetailedTransaction from "./index";

const DetailedTransactionModal = ({ customer_id, transaction_type, transaction_id }) => {
  const [isVisible, setIsVisible] = useState(false);
  const onClose = () => setIsVisible(false);
  const onOpen = () => setIsVisible(true);

  return (
    <Col>
      <Button onClick={onOpen} size="large" type="link">
        Detailed View
      </Button>
      {isVisible && (
        <Modal
          title={
            <div>
              {lo.startCase(transaction_type)} Transaction ID:{" "}
              <span style={{ fontWeight: "bold", paddingLeft: 4 }}>{transaction_id}</span>
            </div>
          }
          open={isVisible}
          onCancel={onClose}
          footer={null}
          centered
          width="90%"
        >
          <DetailedTransaction
            customer_id={customer_id}
            transaction_type={transaction_type}
            transaction_id={transaction_id}
          />
        </Modal>
      )}
    </Col>
  );
};
DetailedTransactionModal.propTypes = {
  customer_id: propTypes.string.isRequired,
  transaction_type: propTypes.string.isRequired,
  transaction_id: propTypes.string.isRequired,
};

export default DetailedTransactionModal;
