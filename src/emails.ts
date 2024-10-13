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
                                       order.userId
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
                               orderDetails.userId
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
                               orderDetails.userId
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
