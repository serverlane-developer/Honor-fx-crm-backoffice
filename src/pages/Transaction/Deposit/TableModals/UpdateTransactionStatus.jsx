import React, { useState } from "react";
import propTypes from "prop-types";
import { Button, Card, Form, Input, Modal, Radio, Row, message } from "antd";
import { useForm } from "antd/es/form/Form";
import Endpoints from "../../../../config/apiConstants";
import callApi from "../../../../helpers/NetworkHelper";
import getAxiosError from "../../../../helpers/getAxiosError";

const UpdateTransactionStatus = ({
  isModal,
  transactionId,
  onSuccess,
  panel_id,
}) =>
  isModal ? (
    <UpdateStatusModal
      transactionId={transactionId}
      panel_id={panel_id}
      onSuccess={onSuccess}
    />
  ) : (
    <UpdateStatusForm
      transactionId={transactionId}
      panel_id={panel_id}
      onSuccess={onSuccess}
    />
  );
UpdateTransactionStatus.propTypes = {
  isModal: propTypes.bool,
  transactionId: propTypes.string.isRequired,
  panel_id: propTypes.string.isRequired,
  onSuccess: propTypes.func,
};
UpdateTransactionStatus.defaultProps = {
  isModal: false,
  onSuccess: () => {},
};

const UpdateStatusModal = ({ transactionId, onSuccess, panel_id }) => {
  const [isVisible, setIsVisible] = useState(false);
  const onClose = () => setIsVisible(false);
  const onOpen = () => setIsVisible(true);

  const onSuccessLocal = () => {
    onClose();
    if (typeof onSuccess === "function") onSuccess();
  };

  return (
    <div>
      {isVisible && (
        <Modal
          title="Update Transaction Status"
          open={isVisible}
          onCancel={onClose}
          footer={null}
          centered
        >
          <UpdateStatusForm
            transactionId={transactionId}
            onSuccess={onSuccessLocal}
            panel_id={panel_id}
          />
        </Modal>
      )}
      <Button type="primary" onClick={onOpen} size="large">
        Update Status
      </Button>
    </div>
  );
};
UpdateStatusModal.propTypes = {
  transactionId: propTypes.string.isRequired,
  panel_id: propTypes.string.isRequired,
  onSuccess: propTypes.func,
};
UpdateStatusModal.defaultProps = {
  onSuccess: () => {},
};

const UpdateStatusForm = ({ transactionId, onSuccess, panel_id }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form] = useForm();

  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };

  const onFinish = async (values) => {
    const endpoint = Endpoints.UPDATE_DEPOSIT_TRANSACTION_STATUS;
    const url = `${Endpoints.BASE_URL}${endpoint.url(
      panel_id
    )}/${transactionId}`;
    try {
      setIsSubmitting(true);
      const { data: resData } = await callApi(endpoint.method, url, values);
      const { status, message: resMessage } = resData;
      if (!status) {
        message.error(resMessage);
        return;
      }
      form.resetFields();
      message.success(resMessage);
      if (typeof onFinish === "function") onSuccess();
    } catch (err) {
      const axiosError = getAxiosError(err);
      const errMessage = "Error while updating transaction";
      console.error(errMessage, err, axiosError);
      message.error(axiosError || errMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!transactionId) return <div>Transaction ID is required</div>;

  return (
    <Card>
      <Form
        {...layout}
        form={form}
        size="large"
        name="create-role"
        autoComplete="off"
        onFinish={onFinish}
        disabled={isSubmitting}
        initialValues={{ status: "success" }}
      >
        <Form.Item name="status" label="Status">
          <Radio.Group>
            <Radio value="success">Success</Radio>
            <Radio value="failed">Failed</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="Message"
          name="message"
          rules={[
            {
              required: true,
            },
            {
              min: 3,
            },
            {
              max: 50,
            },
          ]}
        >
          <Input placeholder="Message" autoComplete="off" />
        </Form.Item>

        <Row justify="center" align="middle">
          <Form.Item style={{ marginTop: 40 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={isSubmitting}
            >
              Submit
            </Button>
          </Form.Item>
        </Row>
      </Form>
    </Card>
  );
};

UpdateStatusForm.propTypes = {
  transactionId: propTypes.string.isRequired,
  panel_id: propTypes.string.isRequired,
  onSuccess: propTypes.func,
};
UpdateStatusForm.defaultProps = {
  onSuccess: () => {},
};

export default UpdateTransactionStatus;
