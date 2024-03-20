import React from "react";
import propTypes from "prop-types";
import { Modal } from "antd";

import LabelValue from "../../../../components/LabelValue";

const ShowCsvModal = ({ csvObj, visible, setVisible }) => {
  return (
    <Modal
      title="CSV Details"
      open={visible}
      onOk={() => setVisible(false)}
      onCancel={() => setVisible(false)}
      footer={false}
      //   width={800}
    >
      <div>
        <LabelValue label="Name" value={csvObj.name} />
        <LabelValue label="Amount" value={csvObj.amount} />
        <LabelValue label="UTR" value={csvObj.utr} />
        <LabelValue label="Date" value={csvObj.date} />
        <LabelValue label="Data" value={csvObj.data} />
      </div>
    </Modal>
  );
};

ShowCsvModal.propTypes = {
  csvObj: propTypes.shape({
    amount: propTypes.string,
    data: propTypes.string,
    date: propTypes.string,
    name: propTypes.string,
    utr: propTypes.string,
  }).isRequired,
  visible: propTypes.bool.isRequired,
  setVisible: propTypes.func.isRequired,
};

export default ShowCsvModal;
