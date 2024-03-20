/* eslint-disable camelcase */
import React, { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { message } from "antd";
import { copyBlobToClipboard } from "../../../../helpers/CopyToClipboardHelper";
import { paymentDetails, paymentDetailsPropType } from "./types";

const PgReceipt = ({
  pg_label,
  payment_status,
  utr_id,
  payment_order_id,
  payment_creation_date,
  account_name,
  amount,
  account_number,
  ifsc,
}) => {
  const receiptRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  // const [receiptCanvas, setCanvas] = useState(null);
  const [src, setSrc] = useState(null);

  const getHtmlAsImage = async () => {
    try {
      const elementToCopy = receiptRef.current;
      if (!elementToCopy) {
        console.error("Receipt not found.");
        return;
      }

      const canvas = await html2canvas(elementToCopy);
      const image = canvas.toDataURL("image/png", 1.0);
      setSrc(image);
    } catch (error) {
      console.error("Error while creating Image", error);

      throw error;
    }
  };

  const copyImageToClipboard = async () => {
    const elementToCopy = receiptRef.current;
    if (!elementToCopy) {
      console.error("Receipt not found.");
      return;
    }

    try {
      const canvas = await html2canvas(elementToCopy);
      canvas.toBlob(async (blobRes) => {
        try {
          if (blobRes) {
            await copyBlobToClipboard(blobRes);
            message.success("Receipt Copied to Clipboard");
          }
        } catch (error) {
          message.error("Error while copying Receipt");
        }
      }, "image/png");
    } catch (error) {
      console.error("Error capturing image:", error);
      // await getHtmlAsImage();
    }
  };

  const initialise = async () => {
    try {
      setIsLoading(true);
      await getHtmlAsImage();
      await copyImageToClipboard();
    } catch (error) {
      console.error("Error while initialising PG Receipt", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initialise();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   const copyReceipt = async () => {
  //     try {
  //       if (!src) {
  //         console.error("SRC not found to copy receipt");
  //       }
  //       await copyBlobToClipboard(src);
  //       message.success("Receipt Copied to Clipboard");
  //       message.success("Receipt Copied to Clipboard");
  //     } catch (error) {
  //       console.error("Error capturing image:", error);
  //       message.error("Error while copying Receipt");
  //     }
  //   };
  //   if (!isLoading && src) copyReceipt();
  // }, [isLoading, src]);

  // const handleCopy = async () => {
  //   try {
  //     let copyObj = "";

  //     if (account_name) {
  //       copyObj += `Account Name: ${account_name}\n`;
  //     }

  //     copyObj += `amount: ${amount}`;
  //     if (account_number && ifsc) {
  //       copyObj += `\n\nBANK DETAILS::\nA/c number: ${account_number} \nIFSC: ${ifsc}`;
  //     }

  //     await copyTextToClipboard(copyObj);
  //     message.success("Details copied to clipboard");
  //   } catch (e) {
  //     message.error("Error while copying payment details");
  //   }
  // };

  // if (isLoading) return <Loader message="Loading Receipt" />;
  // return <img src={src} alt="PG Receipt" />;

  return (
    <div>
      {isLoading && <span style={{ color: "red", fontSize: 12 }}>Loading Receipt as Image</span>}
      {!src ? (
        <div style={{ display: src ? "none" : "block" }} ref={receiptRef}>
          <div
            style={{
              border: "1px solid black",
              padding: "2rem",
              backgroundColor: "white",
              width: "440px",
            }}
          >
            <h3 style={{ color: "green" }}>USER DETAILS:</h3>
            <br />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span className="my-1" style={{ color: "green" }}>
                Account Name:
              </span>
              <span className="my-1">{account_name.toUpperCase()}</span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span className="my-1" style={{ color: "green" }}>
                AMOUNT:
              </span>
              <span className="my-1">{amount}</span>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span className="my-1" style={{ color: "green" }}>
                ACCOUNT NUMBER:
              </span>
              <span className="my-1">{account_number}</span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span className="my-1" style={{ color: "green" }}>
                IFSC:
              </span>
              <span className="my-1">{ifsc}</span>
            </div>

            <hr />
            <br />

            <h4 style={{ color: "green" }}>PAYMENT DETAILS</h4>
            <br />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span className="my-1" style={{ color: "green" }}>
                PAYMENT GATEWAY NAME:
              </span>
              <span className="my-1"> {pg_label?.toUpperCase()}</span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span className="my-1" style={{ color: "green" }}>
                PAYMENT STATUS:
              </span>
              <span className="my-1">{payment_status?.toUpperCase()}</span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span className="my-1" style={{ color: "green" }}>
                UTR ID:
              </span>
              <span className="my-1"> {utr_id}</span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span className="my-1" style={{ color: "green" }}>
                PAYMENT ORDER ID:
              </span>
              <span className="my-1"> {payment_order_id}</span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span className="my-1" style={{ color: "green" }}>
                CREATION DATE:
              </span>
              <span className="my-1">{payment_creation_date}</span>
            </div>
          </div>
        </div>
      ) : (
        <img src={src} alt="PG Receipt" />
      )}
    </div>
  );
};
PgReceipt.propTypes = {
  ...paymentDetailsPropType,
};
PgReceipt.defaultProps = { ...paymentDetails };

export default PgReceipt;
