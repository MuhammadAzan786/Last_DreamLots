import React, { useEffect, useState } from 'react';
import image from "../../assets/images/logo.png"
import jsPDF from 'jspdf';
import { useSelector } from 'react-redux';
import { useParams } from "react-router-dom";
import axios from 'axios';
import { Box, display, margin, width } from '@mui/system';
const styles = {


  base: {

    boxSizing: 'border-box',
    fontFamily: `'Poppins', sans-serif`,
    color: '#333',
    fontSize: '16px',
    backgroundColor: '#f4f4f9', 
    paddingTop: '7rem',
    paddingBottom: '5rem',

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

  },
  invoice: {

    maxWidth: '900px',
    width: '100%',
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '2px solid #0c2f54',
    paddingBottom: '20px',
    marginBottom: '20px',
  },
  logo: {
    width: '150px',
  },
  title: {
    color: '#0c2f54',
    fontSize: '32px',
    fontWeight: 600,
  },
  section: {
    marginBottom: '20px',
  },
  info: {
    display:"flex",
    justifyContent: "end",
    borderBottom: '1px solid #ddd',
    paddingBottom: '10px',
    marginBottom: '10px',
  },
  infoItem: {
    display: 'flex',
    width: '48%',
    margintop: "10px",
    marginBottom: "10px",
  },
  bold: {
    fontWeight: 'bold',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '20px',

  },
  tableHeader: {
    backgroundColor: '#f9f9f9',
    fontWeight: 'bold',
    borderBottom: '2px solid #ddd',
  },

  tableFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    fontWeight: 'bold',
    borderTop: '2px solid #ddd',
    paddingTop: '10px',
    marginTop: '10px',
  },
  footer: {
    textAlign: 'center',
    paddingTop: '20px',
    borderTop: '2px solid #0c2f54',
    marginTop: '20px',
  },
  buttons: {
    margin: '20px',
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
  },
  button: {
    padding: '10px 20px',
    borderRadius: '4px',
    border: 'none',
    color: '#fff',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  printButton: {
    backgroundColor: '#0c2f54',
  },
  downloadButton: {
    backgroundColor: '#007bff',
  },
  buttonIcon: {
    marginRight: '8px',
  },
  // Styles SPECIFICALLY for the scaled content in the PDF
  pdfContent: {

    width: '180mm',
    height: '297mm',

    boxSizing: 'border-box',
    fontFamily: "'Poppins', sans-serif",
    transform: 'scale(0.60)', // Adjust scale factor as needed
    transformOrigin: 'top left',

  },
  pdfContentWrapper: { // New wrapper for centering
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '210mm',  // A4 width
    height: '297mm', // A4 height
  },
  widgth: {
    width: "70vw"
  },
  hightlight: {
    marginLeft: "65px"
  },
  details: {
    marginLeft: "55px"

  },
  // ... (other styles, including table cell styles)
  tableCell: {
    padding: '4px', // Adjust padding to reduce height if needed
    borderBottom: '1px solid #ddd',

    // hyphens: 'auto', // Uncomment if supported and desired 
  },

};



const printInvoice = () => {

  const invoiceContent = document.getElementById('invoice-container').innerHTML;
  const printWindow = window.open('', '', 'height=600,width=800');

  printWindow.document.write(`
    <html>
      <head>
        <title>Invoice</title>
        <style>
          /* Add print-specific styles here, including page breaks */
          @media print {
            body { 
              margin: 0;
            }
            #pdf-content { /* Style the inner container for PDF */
              width: 210mm;
              min-height: 200mm;
              padding: 5mm;
              box-sizing: border-box; 
              font-family: 'Poppins', sans-serif;
            }
            table {
              page-break-inside: avoid; /* Prevent table rows from splitting */
            }
          }
        </style>
      </head>
      <body>
        <div id="pdf-content">
          ${invoiceContent}
        </div>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.onload = function () {
    printWindow.print();
    printWindow.close();
  };
};


const Invoice = () => {
  const { id } = useParams();
  const date = new Date().toLocaleDateString();


  const [data, setOrderData] = useState(null);

  // console.log(data);
  useEffect(() => {
    // console.log("useffect")
    const getOrderDeatail = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_DOMAIN_NAME}/api/order/getorder/${id}`,

        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      setOrderData(response.data.data);
    }
    getOrderDeatail();

  }, [])
  return (
    <div style={styles.base} className='flex-col'>
      {data ? <>
        <div id="invoice-container" style={styles.invoice}>
          <div style={styles.header}>
            <img src={image} alt="Logo" style={styles.logo} />
            <div style={styles.title}>Invoice</div>
          </div>
          <div style={styles.section}>
            <div  style={styles.info}>
              <div style={styles.widgth}>
              <div style={styles.infoItem}>
                <span style={styles.bold}>Pay To:</span>
                <span style={styles.hightlight}>AL Noor Fans</span>
              </div>
              <div  style={styles.infoItem}>
                <span style={styles.bold}>Invoiced To:</span>
                <span style={styles.details}>

                <span>{data.shippingInfo.username},</span>
                  <p>
                  <span>{data.shippingInfo.address},</span>
                  <span>{data.shippingInfo.city},</span>
                  <span>{data.shippingInfo.country}.</span>
                  </p>
                  <p>{data.shippingInfo.email}</p>
                  <p>{data.shippingInfo.phoneNo}</p>
                </span>

              </div>
              </div>
              <div style={styles.infoItem}>
                <div>
                <p><span style={styles.bold}>Date:</span> {data.createdAt.substring(0, 10)}</p>
                <p><span style={styles.bold}>Id:</span>{data._id.substring(data._id)} </p>
                </div>
              </div>
            </div>
            
          </div>
          <div style={styles.section}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <td style={styles.tableCell}>Product Name</td>
                  <td style={styles.tableCell}>Color</td>
                  <td style={styles.tableCell}>Size</td>
                  <td style={styles.tableCell}>QTY</td>
                  <th style={styles.tableCell}>Amount</th>

                </tr>
              </thead>
              <tbody>
                {data.orderItems.map((item, index) => (
                  <tr key={index}>
                    <td style={styles.tableCell}>{item.name}</td>
                    <td style={styles.tableCell}>{item.color}</td>
                    <td style={styles.tableCell}>{item.type}</td>
                    <td style={styles.tableCell}>{item.quantity}</td>
                    <td style={{ ...styles.tableCell, textAlign: 'right' }}>{item.quantity * item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={styles.tableFooter}>
              <div>Total:</div>
              <div>{data.totalPrice}</div>
            </div>
          </div>
          <div style={styles.footer}>
            <p>
              <span style={styles.bold}>NOTE:&nbsp;</span>
              This is a computer-generated receipt and does not require a physical signature.
            </p>

          </div>

        </div>
        <div style={styles.buttons}>
          <button onClick={printInvoice} type="button" style={{ ...styles.button, ...styles.downloadButton }}>
            <span style={styles.buttonIcon}>
              <i className="fa-solid fa-download"></i>
            </span>
            Print
          </button>
        </div> </> : <></>}
    </div>
  );
}






export default Invoice;
