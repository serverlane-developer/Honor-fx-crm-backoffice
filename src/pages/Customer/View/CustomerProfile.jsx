import React, { useEffect, useState } from "react";
import lo from "lodash";
import {
  message,
  Card,
  Descriptions,
  Select,
  Table,
  Button,
  Modal,
  Input,
  Divider,
  Row,
  Tag,
} from "antd";
import { useParams } from "react-router-dom";
import Title from "../../../components/Title";
import apiConstants from "../../../config/apiConstants";
import callApi from "../../../helpers/NetworkHelper";
import getAxiosError from "../../../helpers/getAxiosError";
import Loader from "../../../components/Loader";
import { objectToQueryString } from "../../../helpers/url";
import DataTable from "../../../components/DataTable";
import { formatTimestamp } from "../../../helpers/functions";
import DetailedTransactionModal from "../DetailedTransaction/DetailedTransactionModal";

const TransactionTypeColor = {
  withdraw: "red",
  deposit: "green",
};

const StatusColor = {
  pending: "yellow",
  processing: "orange",
  success: "green",
  failed: "red",
  acknowledged: "blue",
};

const getStatusbyType = (type, status, pg_task) => {
  if (type === "withdraw" && status === "pending" && pg_task) return "processing";
  return status;
};

const CustomerProfile = () => {
  const { customer_id } = useParams();
  // const [modules, setModules] = useState([]);
  const [blockAccountButtonPressed, setBlockAccountButtonPressed] =
    useState(false);
  const [blockAccountReason, setBlockAccountReason] = useState("");
  const [confirmBlockAccountModalOpen, setConfirmBlockAccountModalOpen] = useState(false);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [allCustomerAccounts, setAllCustomerAccounts] = useState([]);
  // const [allTransactionList, setAllTransactionList] = useState([]);
  const [customerAccountDetails, setCustomerAccountDetails] = useState({
    withdrawTransactions: [],
    profileOverview: [],
  });

  const [isAccountsLoading, setIsAccountsLoading] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const [total, setTotal] = useState(0);
  const [isTransactionsLoading, setIsTransactionsLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
    scroll: {
      y: 800,
    },
  });

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      ...tableParams,
      pagination,
      filters,
      ...sorter,
    });
  };

  const initialiseAccounts = async () => {
    try {
      setIsAccountsLoading(true);
      const endpoint = apiConstants.GET_CUSTOMER_ACCOUNTS;
      const url = apiConstants.BASE_URL + endpoint.url(customer_id);
      const response = await callApi(endpoint.method, url);
      const accountsRes = response.data?.data?.accounts || [];

      setAccounts([...accountsRes]);
    } catch (error) {
      console.error("Error while fetching customer accounts", error);
    } finally {
      setIsAccountsLoading(false);
    }
  };

  const gettransactions = async ({ orderBy, dir, limit, skip } = {}) => {
    try {
      const { pageSize, current } = tableParams.pagination;

      let account_number;
      let account_name;
      let ifsc;
      if (selectedAccount) {
        const account = accounts.find((acc) => acc?.value === selectedAccount);
        account_name = account.account_name;
        account_number = account.account_number;
        ifsc = account.ifsc;
      }

      const data = {
        orderBy,
        dir,
        skip: skip || current * pageSize - pageSize,
        limit: limit || pageSize,
        ...(selectedAccount && { account_name, account_number, ifsc }),
      };
      let queryString = objectToQueryString(data);
      if (queryString) queryString = `?${queryString}`;

      const endpoint = apiConstants.GET_CUSTOMER_TRANSACTIONS;
      const url = `${apiConstants.BASE_URL + endpoint.url(customer_id)}?${queryString}`;

      const response = await callApi(endpoint.method, url);

      if (response.error) {
        throw new Error(response.error);
      }
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const initialiseTransactions = async () => {
    try {
      setIsTransactionsLoading(true);
      const res = await gettransactions();
      setTransactions(res?.data?.data?.transactions || []);
      const count = Number(res.headers["x-total-count"] || 0);
      setTotal(count);
    } catch (error) {
      message.error(
        getAxiosError(error) || "Error while fetching transactions"
      );
      console.error("Error while fetching transactions", error);
    } finally {
      setIsTransactionsLoading(false);
    }
  };

  // useEffect(() => {
  // const getCustomerProfile = async ({ orderBy, dir, limit, skip } = {}) => {
  //   try {
  //     const { pageSize, current } = tableParams.pagination;
  // const rowSelection = {
  //   onChange: (selectedRowKeys, selectedRows) => {
  //     setSelectedAccounts(selectedRows);
  //     // console.log('selectedAccounts', selectedAccounts);
  //   },
  //   // getCheckboxProps: (record) => ({
  //   //   disabled: record.name === '', // Column configuration not to be checked
  //   //   name: record.name,
  //   // }),
  // };

  const getCustomerProfile = async ({ orderBy, dir, limit, skip } = {}) => {
    try {
      const { pageSize, current } = tableParams.pagination;

      const data = {
        orderBy,
        dir,
        skip: skip || current * pageSize - pageSize,
        limit: limit || pageSize,
      };
      let queryString = objectToQueryString(data);
      if (queryString) queryString = `?${queryString}`;

      const endpoint = apiConstants.GET_CUSTOMER_BY_ID;
      const url = `${apiConstants.BASE_URL}${endpoint.url}/${customer_id}`;

      const response = await callApi(endpoint.method, url);

      if (response.error) {
        throw new Error(response.error);
      }
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  // const getCustomerTransactions = async ({
  //   order,
  //   dir,
  //   limit,
  //   skip,
  //   username,
  // }) => {
  //   try {
  //     const data = {
  //       limit,
  //       skip,
  //       order,
  //       dir,
  //       username,
  //       // panel_id,
  //       // account_number,
  //       // account_name,
  //       // ifsc,
  //       //  status,
  //       // type,
  //     };
  //     let queryString = objectToQueryString(data);
  //     if (queryString) queryString = `?${queryString}`;

  //     const endpoint = apiConstants.GET_CUSTOMER_TRANSACTIONS;
  //     const url = `${apiConstants.BASE_URL}${endpoint.url(customer_id)}`;

  //     const response = await callApi(endpoint.method, url);
  //     const transactionss = response.data.data.transactions;
  //     setAllTransactionList(transactionss);
  //     // console.log("allTransactionList", transactions, allTransactionList);
  //     if (response.error) {
  //       throw new Error(response.error);
  //     }
  //     return response;
  //   } catch (error) {
  //     console.error(error);
  //     throw error;
  //   }
  // };

  const getCustomerAccounts = async () => {
    try {
      const data = {
        customer_id,
      };
      let queryString = objectToQueryString(data);
      if (queryString) queryString = `?${queryString}`;

      const endpoint = apiConstants.GET_CUSTOMER_ACCOUNTS;
      const url = `${apiConstants.BASE_URL}${endpoint.url(customer_id)}`;

      const response = await callApi(endpoint.method, url);
      const accountss = response.data.data.accounts.map((o) => ({
        ...o,
        key: o.account_id,
      }));
      setAllCustomerAccounts(accountss);
      if (response.error) {
        throw new Error(response.error);
      }
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  useEffect(() => {
    const initialise = async () => {
      try {
        setIsLoading(true);
        const res = await getCustomerProfile();
        await getCustomerAccounts();
        // await getCustomerTransactions({});
        const profileDetails = res?.data?.data || {};
        setCustomerAccountDetails({
          withdrawTransactions: [],
          profileOverview: [
            {
              key: "1",
              label: "UserName",
              children: profileDetails.username,
            },
            // {
            //   key: '2',
            //   label: 'account_name',
            //   children: profileDetails.account_name,
            // },
            // {
            //   key: '3',
            //   label: 'ifsc',
            //   children: profileDetails.ifsc,
            // },
            // {
            //   key: '4',
            //   label: 'account_number',
            //   children: profileDetails.account_number,
            // },
            {
              key: "5",
              label: "created_at",
              children: profileDetails.created_at,
            },
            {
              key: "6",
              label: "total_withdraw_amount",
              children: profileDetails.total_withdraw_amount,
            },
            {
              key: "7",
              label: "total_withdraw_transactions",
              children: profileDetails.total_withdraw_transactions,
            },
          ],
        });
        const count = Number(res.headers["x-total-count"] || 0);
        setTotal(count);
      } catch (error) {
        message.error(getAxiosError(error) || "Error while fetching modules");
        console.error("Error while fetching modules", error);
      } finally {
        setIsLoading(false);
      }
    };

    initialise();
    initialiseAccounts();
  }, []);

  useEffect(() => {
    initialiseTransactions();
  }, [tableParams.pagination, selectedAccount]);

  const columns = [
    {
      title: "Sr No",
      dataIndex: "i",
      key: "transaction_id",
      render: (__, ___, i) =>
        tableParams.pagination.pageSize * (tableParams.pagination.current - 1) +
        i +
        1,
    },
    {
      title: "Type",
      dataIndex: "transaction_type",
      key: "type",
      render: (value) => (
        <Tag color={TransactionTypeColor[value]}>{lo.startCase(value)}</Tag>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (value, row) => {
        const { transaction_type, pg_task } = row;
        const status = getStatusbyType(transaction_type, value, pg_task);
        return <Tag color={StatusColor[status]}>{lo.startCase(status)}</Tag>;
      },
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (value) => formatTimestamp(value),
    },
    {
      title: "Updated At",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (value) => formatTimestamp(value),
    },
    {
      title: "Detailed View",
      dataIndex: "detailed_view",
      key: "transaction_id",
      render: (_, row) => (
        <DetailedTransactionModal
          customer_id={customer_id}
          transaction_id={row.transaction_id}
          transaction_type={row.transaction_type}
        />
      ),
    },
  ];
  const handleSubmitBlockAccount = async () => {
    const newObj = {
      accounts: selectedAccounts.map((o) => o.key),
      reason: blockAccountReason,
    };
    // console.log("newObj", newObj);
    const endpoint = apiConstants.FLAG_CUSTOMER_ACCOUNTS;
    const url = `${apiConstants.BASE_URL}${endpoint.url(customer_id)}`;

    try {
      // console.log('values', values);
      const { data: resData } = await callApi(endpoint.method, url, newObj);
      const { status, message: resMessage } = resData;
      if (!status) {
        message.error(resMessage);
      }
      // form.resetFields();
      message.success(resMessage);
      // navigate("/modules/view", { replace: true });
    } catch (err) {
      const axiosError = getAxiosError(err);
      const errMessage = "Error while creating module";
      console.error(errMessage, err, axiosError);
      message.error(axiosError || errMessage);
    } finally {
      // setIsSubmitting(false);
      // getRpaObj();
      setConfirmBlockAccountModalOpen(false);
      await getCustomerProfile();
      await getCustomerAccounts();
    }
  };

  if (isLoading) return <Loader message="Loading Modules..." />;

  const AccountTableFooter =
    <>
      {blockAccountButtonPressed && selectedAccounts.length > 0 &&
        <Button
          type="primary"
          onClick={() => {
            setConfirmBlockAccountModalOpen(true);
          }}
        >
          Block Selected Accounts
        </Button>
      }
      <div> </div>;
    </>;

  return (
    <div>
      <Title title="Customer Profile" />
      <Card bordered={false}>
        <Descriptions
          title="User Info"
          items={customerAccountDetails.profileOverview}
        />
        <Divider />

        <Row justify="space-between">
          <div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: 18, paddingRight: 8, paddingLeft: 10 }}>
                Accounts:
              </span>
              <Select
                placeholder={
                  isAccountsLoading
                    ? "Loading Customer Accounts"
                    : "Filter transactions by Account"
                }
                loading={isLoading}
                options={accounts}
                disabled={isLoading || isTransactionsLoading}
                onChange={setSelectedAccount}
                value={selectedAccount}
                size="large"
                allowClear
              />
            </div>
          </div>

          {allCustomerAccounts.length > 0 && (
            <Button
              danger
              onClick={() => {
                if (blockAccountButtonPressed) {
                  setSelectedAccounts([]);
                }
                setBlockAccountButtonPressed((prev) => !prev);
              }}
            >
              {blockAccountButtonPressed
                ? "Cancel Block Account"
                : "Block Accounts"}
            </Button>
          )}
        </Row>
        {blockAccountButtonPressed === true && (
          <Table
            rowSelection={{
              type: "checkbox",
              // ...rowSelection,
              onChange: (selectedRowKeys, selectedRows) => {
                setSelectedAccounts(selectedRows);
                // console.log('selectedAccounts', selectedAccounts);
              },
            }}
            onRow={(record) => ({
              style: {
                background: record.key === "blocked" ? "#fff1f0" : "default",
              },
            })}
            fixed
            columns={[
              {
                title: "Account Name",
                dataIndex: "account_name",
                render: (text) => <p>{text}</p>,
              },
              {
                title: "Account Number",
                dataIndex: "account_number",
              },
              {
                title: "IFSC",
                dataIndex: "ifsc",
              },
            ]}
            dataSource={allCustomerAccounts}
            // eslint-disable-next-line react/no-unstable-nested-components
            footer={() => AccountTableFooter}
          />
        )}
        <Divider />

        <DataTable
          bordered
          tableName="Customer Transactions"
          columns={columns}
          dataSource={transactions}
          onChange={handleTableChange}
          loading={isTransactionsLoading}
          rowKey="transaction_id"
          showHeader
          {...tableParams}
          pagination={{ ...tableParams.pagination, total }}
          style={{ width: "100%" }}
          width="100%"
        />

        {/* <Table
          columns={[
            {
              title: 'Sr No',
              dataIndex: 'account_name',
              render: () => <p>1</p>,
            },
            {
              title: 'Source Id',
              dataIndex: 'source_id',
            },
            {
              title: 'type',
              dataIndex: 'transaction_type',
              render: (text) => <p>{String(text).toUpperCase()}</p>,
            },
            {
              title: 'Timestamps',
              dataIndex: 'updated_at',
            },
            {
              title: 'Status',
              dataIndex: 'status',
            }
          ]}
          dataSource={allTransactionList}
        /> */}
      </Card>
      <Modal
        title="Confirm Block Account"
        open={confirmBlockAccountModalOpen}
        onOk={() => {
          handleSubmitBlockAccount();
        }}
        onCancel={() => {
          setConfirmBlockAccountModalOpen(false);
        }}
      >
        <Table
          onRow={(record) => ({
            style: {
              background: record.key === "blocked" ? "#fff1f0" : "default",
            },
          })}
          fixed
          columns={[
            {
              title: "Account",
              dataIndex: "label",
              render: (text) => <p>{text}</p>,
            },
          ]}
          dataSource={selectedAccounts}
        />
        <Input.TextArea
          // maxLength={6}
          rows={4}
          placeholder="Reason to block account"
          value={blockAccountReason}
          onChange={(e) => setBlockAccountReason(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default CustomerProfile;
