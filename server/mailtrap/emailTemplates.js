const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Verify Your Email</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>Thank you for signing up! Your verification code is:</p>
    <div style="text-align: center; margin: 30px 0;">
      <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4CAF50;">{verificationCode}</span>
    </div>
    <p>Enter this code on the verification page to complete your registration.</p>
    <p>This code will expire in 15 minutes for security reasons.</p>
    <p>If you didn't create an account with us, please ignore this email.</p>
    <p>Best regards,<br>Al-Noor Fans</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Successful</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Password Reset Successful</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>We're writing to confirm that your password has been successfully reset.</p>
    <div style="text-align: center; margin: 30px 0;">
      <div style="background-color: #4CAF50; color: white; width: 50px; height: 50px; line-height: 50px; border-radius: 50%; display: inline-block; font-size: 30px;">
        ✓
      </div>
    </div>
    <p>If you did not initiate this password reset, please contact our support team immediately.</p>
    <p>For security reasons, we recommend that you:</p>
    <ul>
      <li>Use a strong, unique password</li>
      <li>Enable two-factor authentication if available</li>
      <li>Avoid using the same password across multiple sites</li>
    </ul>
    <p>Thank you for helping us keep your account secure.</p>
    <p>Best regards,<br>Al-Noor Fans</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Password Reset</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>We received a request to reset your password. If you didn't make this request, please ignore this email.</p>
    <p>To reset your password, click the button below:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{resetURL}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
    </div>
    <p>This link will expire in 1 hour for security reasons.</p>
    <p>Best regards,<br>Al-Noor Fans</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

const WELCOME_EMAIL = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Al-Noor Fans</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9f9f9;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="text-align: center; padding-bottom: 20px;">
            <h1 style="color: #333; font-size: 24px; margin: 0;">Welcome to Al-Noor Fans, [User Name]!</h1>
        </div>
        <div style="padding-bottom: 20px;">
            <p style="color: #555; line-height: 1.6;">Dear [User Name],</p>
            <p style="color: #555; line-height: 1.6;">We are thrilled to have you join our community. At Al-Noor Fans, we are committed to providing high-quality products and exceptional service to ensure your complete satisfaction.</p>
            <p style="color: #555; line-height: 1.6;">Here’s what you can expect:</p>
            <ul style="color: #555; line-height: 1.6; padding-left: 20px; list-style-type: disc;">
                <li><strong>Exclusive Offers:</strong> Get access to special promotions and discounts tailored just for you.</li>
                <li><strong>Latest Updates:</strong> Stay informed about new products and innovations in our lineup.</li>
                <li><strong>Dedicated Support:</strong> Our team is always here to assist you with any inquiries or concerns.</li>
            </ul>
            <p style="color: #555; line-height: 1.6;">To get started, we recommend exploring our website and checking out our latest fan designs. If you have any questions or need assistance, feel free to reach out to our support team at <a href="mailto:support@alnoorfans.com" style="color: #1a73e8; text-decoration: none;">support@alnoorfans.com</a></p>
            <p style="color: #555; line-height: 1.6;">Thank you for choosing Al-Noor Fans. We look forward to serving you and making your experience with us exceptional!</p>
        </div>
        <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p style="color: #777; font-size: 14px; margin: 5px 0;">Warm regards,</p>
            <p style="color: #777; font-size: 14px; margin: 5px 0;">Al-Noor Fans Team</p>
            <p style="color: #777; font-size: 14px; margin: 5px 0;"><strong>Contact Us:</strong></p>
           
            <p style="color: #777; font-size: 14px; margin: 5px 0;">Email: <a href="mailto:info@alnoorfans.com" style="color: #1a73e8; text-decoration: none;">info@alnoorfans.com</a></p>
            <p style="color: #777; font-size: 14px; margin: 5px 0;"><a href="mailto:support@alnoorfans.com" style="color: #1a73e8; text-decoration: none;">support@alnoorfans.com</a></p>
            <p style="color: #777; font-size: 14px; margin: 5px 0;">WhatsApp: +92 336 3336024</p>
            <p style="color: #777; font-size: 14px; margin: 5px 0;">Landline: +92 53 3726024</p>
        </div>
    </div>
</body>
</html>
`;

const ORDER_CONFIRMATION = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation - Al-Noor Fans</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9f9f9;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="text-align: center; padding-bottom: 20px;">
            <h1 style="color: #333; font-size: 24px; margin: 0;">Order Confirmation</h1>
        </div>
        <div style="padding-bottom: 20px;">
            <p style="color: #555; line-height: 1.6;">Dear Customer,</p>
            <p style="color: #555; line-height: 1.6;">Thank you for choosing Al-Noor Fans! We are excited to confirm that your order has been received.</p>
            <p style="color: #555; line-height: 1.6;">Your order number is <strong>{{ORDER_NUMBER}}</strong>.</p>
            <p style="color: #555; line-height: 1.6;">We are currently processing your order and will notify you once it has been shipped. If you have any questions or need assistance, please feel free to contact us at <a style="color: #1a73e8; text-decoration: none;">+92 336 3336024 / +92 53 3726024</a>.</p>
            <p style="color: #555; line-height: 1.6;">As your next step, please make the payment to one of the provided accounts listed below and share your payment receipt via WhatsApp at <a style="color: #1a73e8; text-decoration: none;">+92 336 3336024</a>. Once we confirm your payment, your order will be prepared for shipment.</p>
            <p style="color: #555; line-height: 1.6;">Thank you once again for choosing Al-Noor Fans. We truly appreciate your business and look forward to serving you!</p>
        </div>
        <div style="padding-bottom: 20px;">
            <h2 style="color: #333; font-size: 20px;">Payment Details</h2>
            <p style="color: #555; line-height: 1.6;"><strong>Bank Islami</strong></p>
            <p style="color: #555; line-height: 1.6;">Title: Al-Noor Electric Industries</p>
            <p style="color: #555; line-height: 1.6;">IBAN: PK15BKIP0200600415130001</p>
            
            <p style="color: #555; line-height: 1.6;"><strong>JazzCash</strong></p>
            <p style="color: #555; line-height: 1.6;">Title: Ali Suleman</p>
            <p style="color: #555; line-height: 1.6;">Account Number: 03018602204</p>
            
            <p style="color: #555; line-height: 1.6;"><strong>EasyPaisa</strong></p>
            <p style="color: #555; line-height: 1.6;">Title: Ali Suleman</p>
            <p style="color: #555; line-height: 1.6;">Account Number: 03456333393</p>
        </div>
        <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p style="color: #777; font-size: 14px; margin: 5px 0;">Best regards,</p>
            <p style="color: #777; font-size: 14px; margin: 5px 0;">Al-Noor Fans Team</p>
            <p style="color: #777; font-size: 14px; margin: 5px 0;">Phone: +92 53 3726024</p>
            <p style="color: #777; font-size: 14px; margin: 5px 0;">Mobile: +92 336 3336024</p>
        </div>
    </div>
</body>
</html>

`;
const PAYMENT_CONFIRMATION = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Received - Al-Noor Fans</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9f9f9;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="text-align: center; padding-bottom: 20px;">
            <h1 style="color: #333; font-size: 24px; margin: 0;">Payment Received</h1>
        </div>
        <div style="padding-bottom: 20px;">
            <p style="color: #555; line-height: 1.6;">Dear Customer,</p>
            <p style="color: #555; line-height: 1.6;">We are pleased to inform you that your payment has been successfully received.</p>
            <p style="color: #555; line-height: 1.6;">Your order is now confirmed, and we are preparing it for shipment. You will receive a notification once your order has been dispatched.</p>
            <p style="color: #555; line-height: 1.6;">If you have any questions or require further assistance, please feel free to contact us on +92 336 3336024.</p>
            <p style="color: #555; line-height: 1.6;">Thank you for your trust in Al-Noor Fans. We appreciate your business and look forward to serving you again!</p>
        </div>
        <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p style="color: #777; font-size: 14px; margin: 5px 0;">Best regards,</p>
            <p style="color: #777; font-size: 14px; margin: 5px 0;">Al-Noor Fans Team</p>
            <p style="color: #777; font-size: 14px; margin: 5px 0;"><strong>Contact Us:</strong></p>
           
          <strong>Email:</strong> <a href="mailto:info@alnoorfans.com">info@alnoorfans.com</a><br>
                <strong>Email:</strong> <a href="mailto:support@alnoorfans.com">support@alnoorfans.com</a><br>
             <p style="color: #777; font-size: 14px; margin: 5px 0;">Phone: +92 53 3726024</p>
            <p style="color: #777; font-size: 14px; margin: 5px 0;">Mobile: +92 336 3336024</p>
        </div>
    </div>
</body>
</html>
`;
const ORDER_SHIPPED = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Shipped - Al-Noor Fans</title>
    <style type="text/css">
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            color: #333333;
        }
        .container {
            max-width: 600px;
            margin: 30px auto;
            background-color: #ffffff;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }
        h1 {
            color: #00a859;
            font-size: 26px;
            text-align: center;
            margin-bottom: 20px;
        }
        .content {
            font-size: 16px;
            line-height: 1.6;
            color: #555555;
            margin-bottom: 20px;
        }
        .details {
            margin-top: 20px;
            border: 1px solid #dddddd;
            border-radius: 5px;
            overflow: hidden;
        }
        .details table {
            width: 100%;
            border-collapse: collapse;
        }
        .details th, .details td {
            text-align: left;
            padding: 12px;
            border-bottom: 1px solid #dddddd;
        }
        .details th {
            background-color: #f8f8f8;
            font-weight: bold;
        }
        .footer {
            margin-top: 30px;
            font-size: 14px;
            text-align: center;
            color: #777777;
            border-top: 1px solid #eeeeee;
            padding-top: 20px;
        }
        .footer a {
            color: #00a859;
            text-decoration: none;
        }
        .footer a:hover {
            text-decoration: underline;
        }
        .footer-contact {
            margin-top: 10px;
        }
        .btn {
            display: inline-block;
            background-color: #00a859;
            color: #ffffff;
            padding: 12px 20px;
            border-radius: 4px;
            text-decoration: none;
            font-size: 16px;
            margin-top: 20px;
            text-align: center;
        }
        .btn:hover {
            background-color: #008a47;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎉 Your Order Has Shipped!</h1>
        <p class="content">Hi <strong>{{username}}</strong>,</p>
        <p class="content">We are excited to inform you that your order has been shipped. Your items are on their way, and you can track the shipment using the tracking ID provided below.</p>

        <div class="details">
            <table>
                <tr>
                    <th>Shipping Details</th>
                    <th></th>
                </tr>
                <tr>
                    <td><strong>Email:</strong></td>
                    <td>{{email}}</td>
                </tr>
                <tr>
                    <td><strong>Shipping Address:</strong></td>
                    <td>{{address}}</td>
                </tr>
                <tr>
                    <td><strong>Tracking ID:</strong></td>
                    <td>{{trackingId}}</td>
                </tr>
            </table>
        </div>

        <p class="content">Thank you for shopping with <strong>Al-Noor Fans</strong>. We hope you enjoy your purchase!</p>

        <div class="footer">
            <p>For any questions or support, feel free to reach us at:</p>
            <p class="footer-contact">
                <strong>Email:</strong> <a href="mailto:info@alnoorfans.com">info@alnoorfans.com</a><br>
                <strong>Email:</strong> <a href="mailto:support@alnoorfans.com">support@alnoorfans.com</a><br>
                <strong>Phone:</strong> +92 336 3336024
            </p>
           
        </div>
    </div>
</body>
</html>

`;
const ORDER_CANCELED = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Canceled - Al-Noor Fans</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9f9f9;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="text-align: center; padding-bottom: 20px;">
            <h1 style="color: #d9534f; font-size: 24px; margin: 0;">Order Canceled</h1>
        </div>
        <div style="padding-bottom: 20px;">
            <p style="color: #555; line-height: 1.6;">Dear Customer,</p>
            <p style="color: #555; line-height: 1.6;">We regret to inform you that your order has been canceled. If you have any questions, please contact us on +92 336 3336024.</p>
            <p style="color: #555; line-height: 1.6;">We apologize for any inconvenience.</p>
        </div>
        <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p style="color: #777; font-size: 14px; margin: 5px 0;">Best regards,</p>
            <p style="color: #777; font-size: 14px; margin: 5px 0;">Al-Noor Fans Team</p>
            <strong>Email:</strong> <a href="mailto:info@alnoorfans.com">info@alnoorfans.com</a><br>
                <strong>Email:</strong> <a href="mailto:support@alnoorfans.com">support@alnoorfans.com</a><br>
                <strong>Phone:</strong> +92 336 3336024
        </div>
    </div>
</body>
</html>`;

const MESSAGE_EMAIL = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Template</title>
</head>

<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
    <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); overflow: hidden;">
        <!-- Header -->
        <div style="background-color: #007bff; padding: 20px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 24px;">You've Received a Message</h1>
        </div>

        <!-- Body -->
        <div style="padding: 20px; color: #333;">
            <h2 style="font-size: 20px; color: #007bff;">Hello, {{userName}}</h2>

            <p style="font-size: 16px; line-height: 1.6; color: #555;">
                You have received a new message through the contact form. Here are the details:
            </p>

            <!-- User Details -->
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Email</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">{{userEmail}}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Phone</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">{{userPhone}}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Subject</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">{{userSubject}}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; font-weight: bold;">Message</td>
                    <td style="padding: 10px;">{{userMessage}}</td>
                </tr>
            </table>

            <p style="font-size: 16px; line-height: 1.6; color: #555; margin-top: 20px;">
                Please respond to this inquiry at your earliest convenience.
            </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #007bff; padding: 10px; text-align: center; color: white;">
            <p style="margin: 0; font-size: 14px;">&copy; 2024 Al-Noor Fans. All rights reserved.</p>
            <p style="margin: 0; font-size: 14px;">75-B, Small Industrial Estate G.T Road, Industry Area Main Rd II, Small Industrial Area, Gujrat, Punjab 50700</p>
        </div>
    </div>
</body>

</html>
`;

module.exports = {
  VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  WELCOME_EMAIL,
  ORDER_CONFIRMATION,
  PAYMENT_CONFIRMATION,
  ORDER_SHIPPED,
  ORDER_CANCELED,
  MESSAGE_EMAIL,
};
