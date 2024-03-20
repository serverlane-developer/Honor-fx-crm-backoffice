import React, { useState, useEffect } from "react";
import { Modal, Card, Form, Button, Upload, Row, message } from "antd";
import propTypes from "prop-types";
import { InboxOutlined } from "@ant-design/icons";

import { xlsxParser, csvParser } from "./JsonParser";
import { separateHeadersAndData, formateData } from "./jsonFormater";
import Constants from "../../../../config/apiConstants";
import callApi from "../../../../helpers/NetworkHelper";
import getAxiosError from "../../../../helpers/getAxiosError";
import PreviewTable from "./PreviewTable";

const CsvModal = ({ visible, setVisible, panel_id }) => {
  const [form] = Form.useForm();
  const formName = "depositForm";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileJsonData, setFileJsonData] = useState([]);
  const [formatedData, setFormatedData] = useState([]);
  const [colChange, setColChange] = useState(false);
  const [jsonKeys, setJsonKeys] = useState([]);
  const [utrCalculation, setUtrCalculation] = useState(false);
  const [loading, setLoading] = useState(false);

  // seperate acc num fun

  const customRequest = async ({ file, onSuccess }) => {
    try {
      onSuccess();
      setFileJsonData([]);
      setLoading(true);
      let parsedData;
      // console.log("file type", file.type);
      if (file.type === "application/vnd.ms-excel") {
        parsedData = await xlsxParser(file);
      } else if (file.type === "text/csv") {
        parsedData = await csvParser(file);
      }
      // console.log("recived parse  parse data>>>", parsedData);

      const convertedData = separateHeadersAndData(parsedData.data);
      // console.log("convertedData>>>", convertedData);

      // set header column name selection option
      if (convertedData) {
        // set column selection options
        const selectOption = convertedData.header
          .map((ele) => {
            return {
              value: ele,
              label: ele,
            };
          })
          .filter((ele) => ele.value !== "");
        selectOption.push({ value: "not-available", label: "NA" });
        setJsonKeys(selectOption);

        // set data
        setFileJsonData(convertedData.data);
        const formattedDataX = formateData({
          data: convertedData.data,
          calUtr: utrCalculation,
        });
        setFormatedData(formattedDataX.data);
        form.setFieldsValue({
          [`${formName.toLowerCase()}_name`]: formattedDataX.headerMap.nameCol,
          [`${formName.toLowerCase()}_amount`]:
            formattedDataX.headerMap.amountCol,
          [`${formName.toLowerCase()}_date`]: formattedDataX.headerMap.dateCol,
        });
        setUtrCalculation(true);

        message.success(`file uploaded successfully`);
      } else {
        message.success(`file format is not correct !!`);
      }
    } catch (error) {
      console.error("Error parsing JSON file:", error);
      message.error("File data format is not correct !!!");
      form.resetFields();
    } finally {
      setLoading(false);
    }
  };

  const fileUploadCompProps = {
    customRequest,
    // accept: ".csv",
    multiple: false,
    maxCount: 1,
    beforeUpload: (file) => {
      // console.log("before upload file type",file.type );
      const suportedFileList = ["csv", "xls", "xlsx"];
      const fileExtention = file.name.match(/\.([0-9a-z]+)$/i)[1];
      const isValidFile = suportedFileList.includes(fileExtention);
      if (!isValidFile) {
        message.error(`${file.name} is not CSV / XLSX file`);
      }
      return isValidFile || Upload.LIST_IGNORE;
    },

    onChange(info) {
      //   setUploading(true);
      //   setUploadFile(undefined);
      if (info.file.status !== "uploading") {
        // consoller.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        // message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  useEffect(() => {
    const name = form.getFieldValue(`${formName.toLowerCase()}_name`);
    const amount = form.getFieldValue(`${formName.toLowerCase()}_amount`);
    const date = form.getFieldValue(`${formName.toLowerCase()}_date`);
    const utr = form.getFieldValue(`${formName.toLowerCase()}_utr`);
    const datax = formateData({
      data: fileJsonData,
      name,
      amount,
      date,
      utr,
      calUtr: utrCalculation,
    });
    setFormatedData(datax.data);
  }, [colChange, utrCalculation]);

  const onFinish = async (formData) => {
    const endpoint = Constants.VERIFY_DEPOSIT_TRANSACTION;
    const url = Constants.BASE_URL + endpoint.url(panel_id);

    try {
      setIsSubmitting(true);
      const finalData = formatedData
        .map((x) => {
          const obj = { ...x };
          if (typeof obj.amount === "string") {
            obj.amount = x.amount.replace(",", "");
          }
          return obj;
        })
        .filter((x) => Number(x.amount));
      // console.log("on submit", finalData);
      const filename = formData?.depositform_uploadCsv?.file?.name;
      const { data: resData } = await callApi(endpoint.method, url, {
        csv_arr: finalData,
        filename,
      });
      const { status, message: resMessage, data } = resData;
      if (!status) {
        message.error(resMessage);
        return;
      }
      message.success(resMessage);
      const successRes = data.data
        .filter((x) => x.status)
        .map((x) => x.transaction_id);
      // console.log("success reponse", successRes);
      message.success(
        <>
          <p>successfully verified transations</p>
          <div>
            {successRes.map((x) => (
              <span key={x}>` 2ss `</span>
            ))}
          </div>
        </>
      );
      setVisible(false);
    } catch (error) {
      form.resetFields();
      const errMessage = getAxiosError(error);
      console.error("error on csv verification", error);
      message.error(errMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onReset = () => {
    form.resetFields();
    setFileJsonData([]);
    setFormatedData([]);
    setJsonKeys([]);
    setUtrCalculation(false);
    setColChange(false);
  };

  return (
    <Modal
      title="Upload CSV File"
      open={visible}
      onOk={() => setVisible(false)}
      onCancel={() => setVisible(false)}
      footer={false}
      width={1200}
    >
      <Card>
        <Form
          form={form}
          size="large"
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 14,
          }}
          name={formName}
          autoComplete="off"
          onFinish={onFinish}
          // layout="vertical"
          // initialValues={initialValues}
          // disabled={isLoading || isSubmitting}
        >
          <Form.Item
            label="Upload csv"
            name={`${formName.toLowerCase()}_uploadCsv`}
            rules={[
              {
                required: true,
                message: `Please upload csv file!`,
              },
            ]}
          >
            <Upload.Dragger
              name="files"
              // action="/upload.do"
              style={{
                width: "200px",
                display: "inline-block",
                margin: "10px",
              }}
              {...fileUploadCompProps}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
            </Upload.Dragger>
          </Form.Item>
          {formatedData.length > 0 && !loading && (
            <PreviewTable
              // data={formatedData.slice(0, 5)}
              data={formatedData}
              formName={formName}
              colSelection={jsonKeys}
              colChange={colChange}
              setColChange={setColChange}
              setUtrCalculation={setUtrCalculation}
            />
          )}
          <Row justify="center" align="middle" style={{ marginTop: 40 }}>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={isSubmitting}
                disabled={!formatedData.length > 0}
                // onClick={onFinish}
              >
                Confirm
              </Button>
            </Form.Item>
            <Form.Item style={{ marginLeft: 20 }}>
              <Button
                type="primary"
                size="large"
                // loading={isSubmitting}
                disabled={!formatedData.length > 0}
                onClick={onReset}
              >
                Reset
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </Card>
    </Modal>
  );
};

CsvModal.propTypes = {
  visible: propTypes.bool.isRequired,
  setVisible: propTypes.func.isRequired,
  panel_id: propTypes.string.isRequired,
};

export default CsvModal;
