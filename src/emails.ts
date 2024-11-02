import { formatCurrency } from "./helper";
import { IOrder } from "../types";
import dotenv from "dotenv";
import { formatDate } from "date-fns";

dotenv.config();

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
                  <p style="font-size: 16px; margin-bottom: 30px;">Thank you for your order. We're pleased to confirm that we've received your order and will be process once payment has been received.</p>
                  
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

  const orderReminderEmail = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Reminder</title>
</head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <tr>
            <td style="padding: 40px 30px;">
                <h1 style="color: #444; text-align: center; font-size: 28px; margin-bottom: 20px;">Order Reminder</h1>
                <p style="font-size: 16px; margin-bottom: 20px;">Dear ${
                  order.customer.name || "Valued Customer"
                },</p>
                <p style="font-size: 16px; margin-bottom: 30px;">This is a friendly reminder about your pending order. We noticed that your order is still awaiting payment. To ensure timely processing and delivery, please complete your payment at your earliest convenience.</p>
                
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
                        <td><span style="color: #FFA500; font-weight: bold;">${
                          order.orderStatus
                        }</span></td>
                    </tr>
                    <tr>
                        <td style="font-weight: bold;">Payment Status:</td>
                        <td><span style="color: #FFA500; font-weight: bold;">${
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
                        <td><strong>Total Due:</strong></td>
                        <td align="right"><strong style="font-size: 18px; color: #FFA500;">${formatCurrency(
                          order.totalAmount + order.deliveryFee
                        )}</strong></td>
                    </tr>
                </table>

                <p style="font-size: 16px; margin-bottom: 20px; background-color: #FFF3CD; color: #856404; padding: 15px; border-radius: 6px; border: 1px solid #FFEEBA;">
                    <strong>Action Required:</strong> Please complete your payment to avoid order cancellation. You can make your payment by clicking the button below.
                </p>

                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                        <td>
                            <table border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td align="center" style="border-radius: 3px;" bgcolor="#FFA500">
                                        <a href="${
                                          process.env.CLIENT_DOMAIN +
                                          `/track-order/${order._id}?payment=true`
                                        }" target="_blank" style="font-size: 16px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #FFA500; display: inline-block;">Complete Payment</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>

                <p style="font-size: 16px; margin-top: 30px;">If you have any questions or need assistance, please don't hesitate to contact our customer support team.</p>
                
                <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                    <p style="font-size: 14px; color: #666;">This is an automated email, please do not reply.</p>
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
    orderReminderEmail,
  };
}

export function notifyAdminAboutClaimPaymentEmail(order: IOrder) {
  const formatDate = (date: string) => new Date(date).toLocaleDateString();

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment Verification Required</title>
  </head>
  <body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; line-height: 1.6; color: #000000; background-color: #ffffff; max-width: 600px; margin: 0 auto; padding: 20px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px;">
          <tr>
              <td style="padding: 24px;">
                  <h1 style="color: #000000; text-align: center; font-size: 24px; font-weight: 600; margin-bottom: 24px;">Payment Verification Required</h1>
                  <p style="font-size: 16px; color: #374151; margin-bottom: 16px;">Dear Admin,</p>
                  <p style="font-size: 16px; color: #374151; margin-bottom: 24px;">A user has claimed to have made a payment for an order. Please verify this payment as soon as possible.</p>
                  
                  <table width="100%" cellpadding="12" cellspacing="0" style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 24px;">
                      <tr>
                          <td colspan="2" style="background-color: #000000; color: #ffffff; font-weight: 600; text-align: center; border-radius: 8px 8px 0 0; padding: 12px;">
                              Order Details
                          </td>
                      </tr>
                      <tr>
                          <td style="font-weight: 600; color: #374151;">Order ID:</td>
                          <td style="color: #374151;">${order._id}</td>
                      </tr>
                      <tr>
                          <td style="font-weight: 600; color: #374151;">Customer Name:</td>
                          <td style="color: #374151;">${
                            order.customer.name
                          }</td>
                      </tr>
                      <tr>
                          <td style="font-weight: 600; color: #374151;">Order Total:</td>
                          <td style="color: #374151;">${formatCurrency(
                            order.totalAmount
                          )}</td>
                      </tr>
                      <tr>
                          <td style="font-weight: 600; color: #374151;">Order Date:</td>
                          <td style="color: #374151;">${formatDate(
                            order.orderDate as string
                          )}</td>
                      </tr>
                  </table>
                  
                  <p style="font-size: 16px; color: #374151; margin-bottom: 16px;">Please take the following actions:</p>
                  <ol style="font-size: 16px; color: #374151; margin-bottom: 24px; padding-left: 24px;">
                      <li>Log in to the admin panel</li>
                      <li>Navigate to the order details page</li>
                      <li>Check the payment status and verify the transaction</li>
                      <li>Update the order status accordingly</li>
                  </ol>
                  
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                      <tr>
                          <td align="center">
                              <a href="${
                                process.env.CLIENT_DOMAIN +
                                `/admin/order?orderId=${order._id}`
                              }" style="background-color: #000000; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block; font-size: 16px;">Verify Payment Now</a>
                          </td>
                      </tr>
                  </table>
                  
                  <p style="font-size: 14px; color: #6b7280; text-align: center; margin-top: 24px;">This is an automated message. Please do not reply directly to this email.</p>
              </td>
          </tr>
      </table>
  </body>
  </html>
    `;
}

export function generalNewsLetterEmail(subject: string, body: string) {
  return `
    <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      </head>
      <body style="font-family: 'Space Grotesk', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f8f8; padding: 20px;">
          <tr>
            <td>
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 4px; overflow: hidden;">
                <tr>
                  <td style="padding: 20px;">
                    <h1 style="color: #444; margin-top: 0; font-weight: 600;">${subject}</h1>
                    <div style="color: #666;">
                      ${body}
                    </div>
                    <p style="margin-top: 20px; color: #888; font-size: 14px;">
                      This is an automated email. Please do not reply directly to this message.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="background-color: #f1f1f1; padding: 20px; font-size: 14px; color: #666;">
                    <p style="margin: 0; font-weight: 500;">${
                      process.env.APP_NAME
                    }</p>
                    <p style="margin: 5px 0;">${process.env.APP_ADDRESS}</p>
                    <p style="margin: 5px 0;">Email: ${
                      process.env.APP_EMAIL
                    }</p>
                    <p style="margin: 5px 0;">Phone: ${
                      process.env.APP_PHONE_NUMBER
                    }</p>
                  </td>
                </tr>
                <tr>
                  <td style="background-color: #e1e1e1; text-align: center; padding: 10px; font-size: 12px; color: #888;">
                    © ${new Date().getFullYear()} ${
    process.env.APP_NAME
  }. All rights reserved.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
}

export const orderDispatchEmail = (order: IOrder) => {
  // Map through order items to create rows for each item
  const itemRows = order.items
    .map(
      (item) => `
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #cccccc; font-family: 'Space Grotesk', sans-serif;">${
                  item.name
                }</td>
                <td style="padding: 10px; border-bottom: 1px solid #cccccc; font-family: 'Space Grotesk', sans-serif;">1</td>
                <td style="padding: 10px; border-bottom: 1px solid #cccccc; font-family: 'Space Grotesk', sans-serif;">$${item.price.toFixed(
                  2
                )}</td>
            </tr>
        `
    )
    .join("");

  const totalPrice = order.totalAmount;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Order Has Been Dispatched</title>
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    </head>
    <body style="font-family: 'Space Grotesk', sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
                <td align="center" style="padding: 0;">
                    <table role="presentation" style="width: 602px; border-collapse: collapse; border: 1px solid #cccccc; background-color: #ffffff;">
                        <tr>
                            <td align="center" style="padding: 40px 0 30px 0;">
                                <img src="https://public.blob.vercel-storage.com/eEZHAoPTOBSYGBE/logo-2wQkBgP9mpy7eyA4WVFvs0faoVJLNc.png" alt="Company Logo" width="300" style="height: auto; display: block;" />
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 36px 30px 42px 30px;">
                                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 0 0 36px 0; color: #153643;">
                                            <h1 style="font-size: 24px; margin: 0 0 20px 0; font-family: 'Space Grotesk', sans-serif;">Your Order Has Been Dispatched!</h1>
                                            <p style="margin: 0 0 12px 0; font-size: 16px; line-height: 24px; font-family: 'Space Grotesk', sans-serif;">
                                                Great news! Your order #${
                                                  order._id
                                                } has been dispatched and is on its way to you. Here are the details of your order:
                                            </p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 0;">
                                            <table role="presentation" style="width: 100%; border-collapse: collapse; border: 1px solid #cccccc;">
                                                <tr>
                                                    <th style="padding: 10px; background-color: #f8f8f8; border-bottom: 1px solid #cccccc; font-family: 'Space Grotesk', sans-serif;">Item</th>
                                                    <th style="padding: 10px; background-color: #f8f8f8; border-bottom: 1px solid #cccccc; font-family: 'Space Grotesk', sans-serif;">Quantity</th>
                                                    <th style="padding: 10px; background-color: #f8f8f8; border-bottom: 1px solid #cccccc; font-family: 'Space Grotesk', sans-serif;">Price</th>
                                                </tr>
                                                ${itemRows}
                                                <tr>
                                                    <td style="padding: 10px; font-family: 'Space Grotesk', sans-serif;">Total</td>
                                                    <td style="padding: 10px; font-family: 'Space Grotesk', sans-serif;"></td>
                                                    <td style="padding: 10px; font-weight: bold; font-family: 'Space Grotesk', sans-serif;">$${totalPrice}</td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 30px 0 0 0;">
                                            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                                <tr>
                                                    <td style="padding: 0; text-align: center;">
                                                        <a href=${
                                                          process.env
                                                            .CLIENT_DOMAIN +
                                                          `/track-order/${order._id}`
                                                        } style="font-size: 16px; font-family: 'Space Grotesk', sans-serif; color: #ffffff; text-decoration: none; border-radius: 4px; padding: 10px 20px; border: 1px solid #0066cc; display: inline-block; background-color: #0066cc;">Track Your Order</a>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 30px; background-color: #0066cc;">
                                <table role="presentation" style="width: 100%; border-collapse: collapse; color: #ffffff; font-family: 'Space Grotesk', sans-serif;">
                                    <tr>
                                        <td style="padding: 0; width: 50%;" align="left">
                                            <p style="margin: 0; font-size: 14px; line-height: 20px;">&reg; Someone, Somewhere 2023<br/><a href="http://www.example.com" style="color: #ffffff; text-decoration: underline;">Unsubscribe</a></p>
                                        </td>
                                        <td style="padding: 0; width: 50%;" align="right">
                                            <table role="presentation" style="border-collapse: collapse;">
                                                <tr>
                                                    <td style="padding: 0 0 0 10px; width: 38px;">
                                                        <a href="http://www.twitter.com/" style="color: #ffffff;"><img src="https://assets.codepen.io/210284/tw_1.png" alt="Twitter" width="38" style="height: auto; display: block; border: 0;" /></a>
                                                    </td>
                                                    <td style="padding: 0 0 0 10px; width: 38px;">
                                                        <a href="http://www.facebook.com/" style="color: #ffffff;"><img src="https://assets.codepen.io/210284/fb_1.png" alt="Facebook" width="38" style="height: auto; display: block; border: 0;" /></a>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
};

export const orderCancelledEmail = (order: IOrder) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Cancellation</title>
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    </head>
    <body style="font-family: 'Space Grotesk', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <tr>
                <td style="padding: 40px 30px;">
                    <h1 style="color: #444; text-align: center; font-size: 28px; margin-bottom: 20px;">Order Cancellation</h1>
                    <p style="font-size: 16px; margin-bottom: 20px;">Dear ${
                      order.customer.name || "Valued Customer"
                    },</p>
                    <p style="font-size: 16px; margin-bottom: 30px;">We regret to inform you that your order has been cancelled. We apologize for any inconvenience this may have caused.</p>
                    
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
                            <td>${formatDate(order.orderDate, "PPP")}</td>
                        </tr>
                        <tr>
                            <td style="font-weight: bold;">Order Status:</td>
                            <td><span style="color: #FF0000; font-weight: bold;">Cancelled</span></td>
                        </tr>
                    </table>

                    <table width="100%" cellpadding="10" cellspacing="0" style="background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 6px; margin-bottom: 30px;">
                        <tr style="background-color: #f8f8f8;">
                            <td colspan="3"><h2 style="color: #444; margin-bottom: 10px; font-size: 20px;">Cancelled Items</h2></td>
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
                            <td><strong>Total Refunded:</strong></td>
                            <td align="right"><strong style="font-size: 18px; color: #4CAF50;">${formatCurrency(
                              order.totalAmount + order.deliveryFee
                            )}</strong></td>
                        </tr>
                    </table>

                    <p style="font-size: 16px; margin-bottom: 20px;">If you have made any payment for this order, a full refund will be processed within 3-5 business days.</p>
                    <p style="font-size: 16px; margin-bottom: 20px;">If you have any questions about this cancellation or need further assistance, please don't hesitate to contact our customer support team.</p>
                    <p style="font-size: 16px; margin-bottom: 20px;">We apologize again for any inconvenience and hope to serve you better in the future.</p>
                    
                    <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                        <p style="font-size: 14px; color: #666;">This is an automated email, please do not reply.</p>
                    </div>
                </td>
            </tr>
        </table>
    </body>
    </html>
  `;
