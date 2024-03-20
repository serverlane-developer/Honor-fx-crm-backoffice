/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from "react";
import propTypes from "prop-types";
import { Button, Card, Form, Input, Modal, Radio, Row, message, Upload } from "antd";
import { useForm } from "antd/es/form/Form";
import { UploadOutlined } from "@ant-design/icons";
import Endpoints from "../../../config/apiConstants";
import callApi from "../../../helpers/NetworkHelper";
import getAxiosError from "../../../helpers/getAxiosError";

const UpdateTransactionStatus = ({ isModal, transactionId, onSuccess, panel_id }) =>
  isModal ? (
    <UpdateStatusModal transactionId={transactionId} panel_id={panel_id} onSuccess={onSuccess} />
  ) : (
    <UpdateStatusForm transactionId={transactionId} panel_id={panel_id} onSuccess={onSuccess} />
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
        <Modal title="Update Transaction Status" open={isVisible} onCancel={onClose} footer={null} centered>
          <UpdateStatusForm transactionId={transactionId} onSuccess={onSuccessLocal} panel_id={panel_id} />
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
  const [fileList, setFileList] = useState([]);

  const [form] = useForm();

  const isSuccess = Form.useWatch("status", form) === "success";

  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };

  const onFinish = async (values) => {
    let newValues = { ...values };
    const endpoint = Endpoints.UPDATE_WITHDRAW_TRANSACTION_STATUS;
    const url = `${Endpoints.BASE_URL}${endpoint.url(panel_id)}/${transactionId}`;
    try {
      setIsSubmitting(true);
      if (fileList.length) {
        newValues = new FormData();
        const objKeys = Object.keys(values);
        for (let i = 0; i < objKeys.length; i += 1) {
          newValues.append(objKeys[i], values[objKeys[i]]);
        }
        newValues.append("receipt_image", fileList[0], fileList[0].name);
      }

      const { data: resData } = await callApi(endpoint.method, url, newValues, {
        "Content-type": "multipart/form-data",
      });
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
          label={isSuccess ? "UTR" : "Message"}
          name={isSuccess ? "utr_id" : "api_error"}
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
          <Input placeholder={isSuccess ? "UTR" : "Message"} autoComplete="off" />
        </Form.Item>

        {form.getFieldValue().status === "success" && (
          <Form.Item
            name="file"
            label="Upload"
            // valuePropName="fileList"
            // getValueFromEvent={normFile}
            rules={[
              {
                required: false,
              },
            ]}
          >
            <Upload
              name="file"
              // beforeUpload={Upload.LIST_IGNORE}
              listType="picture"
              maxCount={1}
              accept=".pdf"
              // onPreview={(e) => (e?.originFileObj ? window.open(URL.createObjectURL(e?.originFileObj)) : null)}
              // showUploadList={{ showDownloadIcon: false, showPreviewIcon: true, showRemoveIcon: true }}
              onRemove={(file) => {
                const index = fileList.indexOf(file);
                const newFileList = fileList.slice();
                newFileList.splice(index, 1);
                setFileList(newFileList);
              }}
              beforeUpload={(file) => {
                setFileList([...fileList, file]);
                return false;
              }}
              fileList={fileList}
            >
              <Button icon={<UploadOutlined />}>Click to upload</Button>
            </Upload>
          </Form.Item>
        )}

        <Row justify="center" align="middle">
          <Form.Item style={{ marginTop: 40 }}>
            <Button type="primary" htmlType="submit" size="large" loading={isSubmitting}>
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
