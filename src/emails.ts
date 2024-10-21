import { formatCurrency } from "./helper";
import { IOrder } from "../types";

export function orderEmail(order: IOrder, totalAmount: number) {
  const itemsHtml = order.items
    .map(
      (item) => `
     <tr>
         <td style="padding: 10px; border-bottom: 1px solid #dddddd;">${
           item.name
         }</td>
         <td style="text-align: right; padding: 10px; border-bottom: 1px solid #dddddd;">
           1
         </td>
         <td style="text-align: right; padding: 10px; border-bottom: 1px solid #dddddd;">${formatCurrency(
           item.discountedPrice || item.price
         )}</td>
     </tr>
 `
    )
    .join("");

  return `
     <table role="presentation" style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; line-height: 1.6; color: #000000; margin: 0; padding: 0; background-color: #ffffff;">
         <tr>
             <td style="padding: 0;">
                 <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border: 1px solid #000000;">
                     <tr>
                         <td style="text-align: center; padding-bottom: 20px;">
                             <img src="https://via.placeholder.com/150x50" alt="Company Logo" style="max-width: 150px; height: auto;">
                         </td>
                     </tr>
                     <tr>
                         <td style="padding-bottom: 20px;">
                             <h1 style="color: #000000; font-size: 24px; margin-bottom: 10px;">New Order Received!</h1>
                             <p style="margin: 0;">Hello Admin,</p>
                             <p style="margin: 10px 0 0;">You have received a new order. Here are the details:</p>
                         </td>
                     </tr>
                     <tr>
                         <td style="background-color: #f8f8f8; padding: 15px; border: 1px solid #000000;">
                             <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                 <tr>
                                     <td style="padding: 5px 0;"><strong>Order ID:</strong></td>
                                     <td style="padding: 5px 0;">#${
                                       order._id
                                     }</td>
                                 </tr>
                                 <tr>
                                     <td style="padding: 5px 0;"><strong>Date:</strong></td>
                                     <td style="padding: 5px 0;">${new Date(
                                       order.orderDate
                                     ).toUTCString()}</td>
                                 </tr>
                                 <tr>
                                     <td style="padding: 5px 0;"><strong>Customer:</strong></td>
                                     <td style="padding: 5px 0;">${
                                       order.customer.email
                                     }</td>
                                 </tr>
                                 <tr>
                                     <td style="padding: 5px 0;"><strong>Total Amount:</strong></td>
                                     <td style="padding: 5px 0;">${formatCurrency(
                                       totalAmount
                                     )}</td>
                                 </tr>
                             </table>
                         </td>
                     </tr>
                     <tr>
                         <td style="padding-top: 20px;">
                             <h2 style="color: #000000; font-size: 18px; margin-bottom: 10px;">Order Items:</h2>
                             <table role="presentation" style="width: 100%; border-collapse: collapse; border: 1px solid #000000;">
                                 <tr style="background-color: #f0f0f0;">
                                     <th style="text-align: left; padding: 10px; border-bottom: 1px solid #000000;">Item</th>
                                     <th style="text-align: right; padding: 10px; border-bottom: 1px solid #000000;">Quantity</th>
                                     <th style="text-align: right; padding: 10px; border-bottom: 1px solid #000000;">Price</th>
                                 </tr>
                                 ${itemsHtml}
                             </table>
                         </td>
                     </tr>
                     <tr>
                         <td style="padding-top: 20px;">
                             <a href="#" style="display: inline-block; padding: 10px 20px; background-color: #000000; color: #ffffff; text-decoration: none;">View Order Details</a>
                         </td>
                     </tr>
                     <tr>
                         <td style="padding-top: 20px; border-top: 1px solid #000000; text-align: center; color: #000000; font-size: 12px;">
                             <p style="margin: 10px 0;">This is an automated email. Please do not reply.</p>
                             <p style="margin: 10px 0;">&copy; 2023 Your Company Name. All rights reserved.</p>
                         </td>
                     </tr>
                 </table>
             </td>
         </tr>
     </table>
 `;
}

export function failedOrderEmail(orderDetails: IOrder, failureReason: string) {
  return `
     <table role="presentation" style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; line-height: 1.6; color: #000000; margin: 0; padding: 0; background-color: #ffffff;">
         <tr>
             <td style="padding: 0;">
                 <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border: 1px solid #000000;">
                     <tr>
                         <td style="text-align: center; padding-bottom: 20px;">
                             <img src="https://via.placeholder.com/150x50" alt="Company Logo" style="max-width: 150px; height: auto;">
                         </td>
                     </tr>
                     <tr>
                         <td style="padding-bottom: 20px;">
                             <h1 style="color: #000000; font-size: 24px; margin-bottom: 10px;">Order Failed</h1>
                             <p style="margin: 0;">Dear ${
                               orderDetails.customer.email
                             },</p>
                             <p style="margin: 10px 0 0;">We're sorry, but there was an issue processing your recent order. Here are the details:</p>
                         </td>
                     </tr>
                     <tr>
                         <td style="background-color: #f8f8f8; padding: 15px; border: 1px solid #000000;">
                             <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                 <tr>
                                     <td style="padding: 5px 0;"><strong>Order ID:</strong></td>
                                     <td style="padding: 5px 0;">#${
                                       orderDetails._id
                                     }</td>
                                 </tr>
                                 <tr>
                                     <td style="padding: 5px 0;"><strong>Date:</strong></td>
                                     <td style="padding: 5px 0;">${new Date(
                                       orderDetails.orderDate
                                     ).toUTCString()}</td>
                                 </tr>
                                 <tr>
                                     <td style="padding: 5px 0;"><strong>Total Amount:</strong></td>
                                     <td style="padding: 5px 0;">${formatCurrency(
                                       orderDetails.totalAmount
                                     )}</td>
                                 </tr>
                                 <tr>
                                     <td style="padding: 5px 0;"><strong>Reason for Failure:</strong></td>
                                     <td style="padding: 5px 0;">${failureReason}</td>
                                 </tr>
                             </table>
                         </td>
                     </tr>
                     <tr>
                         <td style="padding-top: 20px;">
                             <p style="margin-bottom: 20px;">We apologize for any inconvenience this may have caused. You can retry your order by clicking the button below:</p>
                             <table role="presentation" style="margin: 0 auto;">
                                 <tr>
                                     <td style="background-color: #000000; border-radius: 4px; text-align: center;">
                                         <a href="${
                                           orderDetails.paymentLink
                                         }" style="display: inline-block; padding: 12px 24px; color: #ffffff; text-decoration: none; font-weight: bold;">Retry Order</a>
                                     </td>
                                 </tr>
                             </table>
                         </td>
                     </tr>
                     <tr>
                         <td style="padding-top: 20px;">
                             <p>If you continue to experience issues or have any questions, please don't hesitate to contact our customer support team.</p>
                             <p>Thank you for your patience and understanding.</p>
                         </td>
                     </tr>
                     <tr>
                         <td style="padding-top: 20px; border-top: 1px solid #000000; text-align: center; color: #000000; font-size: 12px;">
                             <p style="margin: 10px 0;">This is an automated email. Please do not reply.</p>
                             <p style="margin: 10px 0;">&copy; 2023 Your Company Name. All rights reserved.</p>
                         </td>
                     </tr>
                 </table>
             </td>
         </tr>
     </table>
 `;
}

export function underpaidOrderEmail(orderDetails: IOrder, amountPaid: number) {
  return `
     <table role="presentation" style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; line-height: 1.6; color: #000000; margin: 0; padding: 0; background-color: #ffffff;">
         <tr>
             <td style="padding: 0;">
                 <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border: 1px solid #000000;">
                     <tr>
                         <td style="text-align: center; padding-bottom: 20px;">
                             <img src="https://via.placeholder.com/150x50" alt="Company Logo" style="max-width: 150px; height: auto;">
                         </td>
                     </tr>
                     <tr>
                         <td style="padding-bottom: 20px;">
                             <h1 style="color: #000000; font-size: 24px; margin-bottom: 10px;">Underpaid Order</h1>
                             <p style="margin: 0;">Dear ${
                               orderDetails.customer.email
                             },</p>
                             <p style="margin: 10px 0 0;">We've received a payment for your recent order, but there seems to be a shortfall. Here are the details:</p>
                         </td>
                     </tr>
                     <tr>
                         <td style="background-color: #f8f8f8; padding: 15px; border: 1px solid #000000;">
                             <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                 <tr>
                                     <td style="padding: 5px 0;"><strong>Order ID:</strong></td>
                                     <td style="padding: 5px 0;">#${
                                       orderDetails._id
                                     }</td>
                                 </tr>
                                 <tr>
                                     <td style="padding: 5px 0;"><strong>Date:</strong></td>
                                     <td style="padding: 5px 0;">${new Date(
                                       orderDetails.orderDate
                                     ).toUTCString()}</td>
                                 </tr>
                                 <tr>
                                     <td style="padding: 5px 0;"><strong>Total Amount Due:</strong></td>
                                     <td style="padding: 5px 0;">${formatCurrency(
                                       orderDetails.totalAmount
                                     )}</td>
                                 </tr>
                                 <tr>
                                     <td style="padding: 5px 0;"><strong>Amount Paid:</strong></td>
                                     <td style="padding: 5px 0;">$${formatCurrency(
                                       amountPaid
                                     )}</td>
                                 </tr>
                                 <tr>
                                     <td style="padding: 5px 0;"><strong>Remaining Balance:</strong></td>
                                     <td style="padding: 5px 0;">$${formatCurrency(
                                       orderDetails.totalAmount - amountPaid
                                     )}</td>
                                 </tr>
                             </table>
                         </td>
                     </tr>
                     <tr>
                         <td style="padding-top: 20px;">
                             <p style="margin-bottom: 20px;">To complete your order, please reach out to our suport by replying this email</p>

                         </td>
                     </tr>
                     <tr>
                         <td style="padding-top: 20px;">
                             <p>If you believe this is an error or have any questions, please don't hesitate to contact our customer support team.</p>
                             <p>Thank you for your prompt attention to this matter.</p>
                         </td>
                     </tr>
                     <tr>
                         <td style="padding-top: 20px; border-top: 1px solid #000000; text-align: center; color: #000000; font-size: 12px;">
                             <p style="margin: 10px 0;">This is an automated email. Please do not reply.</p>
                             <p style="margin: 10px 0;">&copy; 2023 Your Company Name. All rights reserved.</p>
                         </td>
                     </tr>
                 </table>
             </td>
         </tr>
     </table>
 `;
}

export function successfulOrderEmail(order: IOrder) {
  const formatDate = (date: string) => new Date(date).toLocaleDateString();

  const orderConfirmationEmail = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
  </head>
  <body style="font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <tr>
              <td style="padding: 40px 30px;">
                  <h1 style="color: #444; text-align: center; font-size: 28px; margin-bottom: 20px;">Order Confirmation</h1>
                  <p style="font-size: 16px; margin-bottom: 20px;">Dear ${
                    order.customer.name || "Valued Customer"
                  },</p>
                  <p style="font-size: 16px; margin-bottom: 30px;">Thank you for your order. We're pleased to confirm that we've received your order and it's being processed.</p>
                  
                  <table width="100%" cellpadding="10" cellspacing="0" style="background-color: #f8f8f8; border-radius: 6px; margin-bottom: 30px;">
                      <tr>
                          <td colspan="2"><h2 style="color: #444; margin-bottom: 10px; font-size: 20px;">Order Details</h2></td>
                      </tr>
                      <tr>
                          <td style="font-weight: bold;">Order Number:</td>
                          <td>${order._id}</td>
                      </tr>
                      <tr>
                          <td style="font-weight: bold;">Order Date:</td>
                          <td>${formatDate(order.orderDate as string)}</td>
                      </tr>
                      <tr>
                          <td style="font-weight: bold;">Order Status:</td>
                          <td><span style="color: #4CAF50; font-weight: bold;">${
                            order.orderStatus
                          }</span></td>
                      </tr>
                      <tr>
                          <td style="font-weight: bold;">Payment Status:</td>
                          <td><span style="color: #4CAF50; font-weight: bold;">${
                            order.paymentStatus
                          }</span></td>
                      </tr>
                  </table>
  
                  <table width="100%" cellpadding="10" cellspacing="0" style="background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 6px; margin-bottom: 30px;">
                      <tr style="background-color: #f8f8f8;">
                          <td colspan="3"><h2 style="color: #444; margin-bottom: 10px; font-size: 20px;">Items Ordered</h2></td>
                      </tr>
                      ${order.items
                        .map(
                          (item) => `
                      <tr>
                          <td style="border-bottom: 1px solid #e0e0e0;"><strong>${
                            item.name
                          } (${
                            item.colorPrefrence
                          })</strong><br><span style="color: #666; font-size: 14px;">1x</span></td>
                          <td align="right" style="border-bottom: 1px solid #e0e0e0;">${formatCurrency(
                            item.discountedPrice || item.price
                          )}</td>
                      </tr>
                      `
                        )
                        .join("")}
                      <tr>
                          <td><strong>Subtotal:</strong></td>
                          <td align="right">${formatCurrency(
                            order.totalAmount
                          )}</td>
                      </tr>
                      <tr>
                          <td><strong>Delivery Fee:</strong></td>
                          <td align="right">${formatCurrency(
                            order.deliveryFee
                          )}</td>
                      </tr>
                      <tr style="background-color: #f8f8f8;">
                          <td><strong>Total:</strong></td>
                          <td align="right"><strong style="font-size: 18px; color: #4CAF50;">${formatCurrency(
                            order.totalAmount + order.deliveryFee
                          )}</strong></td>
                      </tr>
                  </table>
  
                  <table width="100%" cellpadding="10" cellspacing="0" style="background-color: #f8f8f8; border-radius: 6px; margin-bottom: 30px;">
                      <tr>
                          <td><h2 style="color: #444; margin-bottom: 10px; font-size: 20px;">Shipping Address</h2></td>
                      </tr>
                      <tr>
                          <td>
                              ${order.address.address}<br>
                              ${order.address.lga}, ${order.address.state}<br>
                              Nigeria
                          </td>
                      </tr>
                  </table>
  
                  <p style="font-size: 16px; margin-bottom: 20px;">If you have any questions about your order, please don't hesitate to contact us.</p>
                  <p style="font-size: 16px; margin-bottom: 20px;">Thank you for shopping with us!</p>
                  
                  <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                      <p style="font-size: 14px; color: #666;">This is an automated email, please do not reply.</p>
                  </div>
              </td>
          </tr>
      </table>
  </body>
  </html>
    `;

  const paymentReceivedEmail = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment Received</title>
  </head>
  <body style="font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <tr>
              <td style="padding: 40px 30px;">
                  <h1 style="color: #444; text-align: center; font-size: 28px; margin-bottom: 20px;">Payment Received</h1>
                  <p style="font-size: 16px; margin-bottom: 30px;">A payment has been received for the following order:</p>
                  
                  <table width="100%" cellpadding="10" cellspacing="0" style="background-color: #f8f8f8; border-radius: 6px; margin-bottom: 30px;">
                      <tr>
                          <td colspan="2"><h2 style="color: #444; margin-bottom: 10px; font-size: 20px;">Order Details</h2></td>
                      </tr>
                      <tr>
                          <td style="font-weight: bold;">Order Number:</td>
                          <td>${order._id}</td>
                      </tr>
                      <tr>
                          <td style="font-weight: bold;">Order Date:</td>
                          <td>${formatDate(order.orderDate as string)}</td>
                      </tr>
                      <tr>
                          <td style="font-weight: bold;">Order Status:</td>
                          <td><span style="color: #4CAF50; font-weight: bold;">${
                            order.orderStatus
                          }</span></td>
                      </tr>
                      <tr>
                          <td style="font-weight: bold;">Payment Status:</td>
                          <td><span style="color: #4CAF50; font-weight: bold;">${
                            order.paymentStatus
                          }</span></td>
                      </tr>
                  </table>
  
                  <table width="100%" cellpadding="10" cellspacing="0" style="background-color: #f8f8f8; border-radius: 6px; margin-bottom: 30px;">
                      <tr>
                          <td colspan="2"><h2 style="color: #444; margin-bottom: 10px; font-size: 20px;">Customer Information</h2></td>
                      </tr>
                      <tr>
                          <td style="font-weight: bold;">Name:</td>
                          <td>${order.customer.name || "Not provided"}</td>
                      </tr>
                      <tr>
                          <td style="font-weight: bold;">Email:</td>
                          <td><a href="mailto:${
                            order.customer.email
                          }" style="color: #1e88e5; text-decoration: none;">${
    order.customer.email
  }</a></td>
                      </tr>
                      <tr>
                          <td style="font-weight: bold;">Phone:</td>
                          <td>${
                            order.customer.phoneNumber || "Not provided"
                          }</td>
                      </tr>
                  </table>
  
                  <table width="100%" cellpadding="10" cellspacing="0" style="background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 6px; margin-bottom: 30px;">
                      <tr style="background-color: #f8f8f8;">
                          <td colspan="3"><h2 style="color: #444; margin-bottom: 10px; font-size: 20px;">Items Ordered</h2></td>
                      </tr>
                      ${order.items
                        .map(
                          (item) => `
                      <tr>
                          <td style="border-bottom: 1px solid #e0e0e0;"><strong>${
                            item.name
                          } (${
                            item.colorPrefrence
                          })</strong><br><span style="color: #666; font-size: 14px;">1x</span></td>
                          <td align="right" style="border-bottom: 1px solid #e0e0e0;">${formatCurrency(
                            item.discountedPrice || item.price
                          )}</td>
                      </tr>
                      `
                        )
                        .join("")}
                      <tr>
                          <td><strong>Subtotal:</strong></td>
                          <td align="right">${formatCurrency(
                            order.totalAmount
                          )}</td>
                      </tr>
                      <tr>
                          <td><strong>Delivery Fee:</strong></td>
                          <td align="right">${formatCurrency(
                            order.deliveryFee
                          )}</td>
                      </tr>
                      <tr style="background-color: #f8f8f8;">
                          <td><strong>Total Paid:</strong></td>
                          <td align="right"><strong style="font-size: 18px; color: #4CAF50;">${formatCurrency(
                            order.totalAmount + order.deliveryFee
                          )}</strong></td>
                      </tr>
                  </table>
  
                  <table width="100%" cellpadding="10" cellspacing="0" style="background-color: #f8f8f8; border-radius: 6px; margin-bottom: 30px;">
                      <tr>
                          <td><h2 style="color: #444; margin-bottom: 10px; font-size: 20px;">Shipping Address</h2></td>
                      </tr>
                      <tr>
                          <td>
                              ${order.address.address}<br>
                              ${order.address.lga}, ${order.address.state}<br>
                              Nigeria
                          </td>
                      </tr>
                  </table>
  
                  <p style="font-size: 16px; margin-bottom: 20px; background-color: #FFF3CD; color: #856404; padding: 15px; border-radius: 6px; border: 1px solid #FFEEBA;">
                      <strong>Action Required:</strong> Please process this order as soon as possible.
                  </p>
  
                  <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                      <p style="font-size: 14px; color: #666;">This is an automated email for administrative purposes.</p>
                  </div>
              </td>
          </tr>
      </table>
  </body>
  </html>
    `;

  return {
    orderConfirmationEmail,
    paymentReceivedEmail,
  };
}
