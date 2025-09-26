// Replit Mail utility for sending emails
// Based on replitmail blueprint integration

function getAuthToken() {
  const xReplitToken = process.env.REPL_IDENTITY
    ? "repl " + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
      ? "depl " + process.env.WEB_REPL_RENEWAL
      : null;

  if (!xReplitToken) {
    throw new Error(
      "No authentication token found. Please set REPL_IDENTITY or ensure you're running in Replit environment."
    );
  }

  return xReplitToken;
}

/**
 * Send email using Replit Mail service
 * @param {Object} message - Email message object
 * @param {string|string[]} message.to - Recipient email address(es)
 * @param {string|string[]} [message.cc] - CC recipient email address(es)
 * @param {string} message.subject - Email subject
 * @param {string} [message.text] - Plain text body
 * @param {string} [message.html] - HTML body
 * @param {Array} [message.attachments] - Email attachments
 * @returns {Promise<Object>} Email send result
 */
async function sendEmail(message) {
  const authToken = getAuthToken();

  const response = await fetch(
    "https://connectors.replit.com/api/v2/mailer/send",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X_REPLIT_TOKEN": authToken,
      },
      body: JSON.stringify({
        to: message.to,
        cc: message.cc,
        subject: message.subject,
        text: message.text,
        html: message.html,
        attachments: message.attachments,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to send email");
  }

  return await response.json();
}

/**
 * Send contact form email
 * @param {Object} formData - Contact form data
 * @param {string} formData.name - Sender name
 * @param {string} formData.email - Sender email
 * @param {string} formData.subject - Email subject
 * @param {string} formData.message - Email message
 * @param {string} recipientEmail - Email address to send the contact form to
 * @returns {Promise<Object>} Email send result
 */
async function sendContactEmail(formData, recipientEmail) {
  const { name, email, subject, message } = formData;
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px;">
        New Contact Form Submission - Stonehood
      </h2>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #667eea;">Contact Details</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
      </div>
      
      <div style="background: #fff; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h3 style="margin-top: 0; color: #333;">Message</h3>
        <p style="line-height: 1.6; color: #555;">${message.replace(/\n/g, '<br>')}</p>
      </div>
      
      <div style="margin-top: 20px; padding: 15px; background: #e8f2ff; border-radius: 8px;">
        <p style="margin: 0; font-size: 0.9em; color: #666;">
          <strong>Reply to:</strong> ${email}<br>
          <strong>Sent from:</strong> Stonehood Contact Form<br>
          <strong>Timestamp:</strong> ${new Date().toLocaleString()}
        </p>
      </div>
    </div>
  `;

  const textContent = `
New Contact Form Submission - Stonehood

Contact Details:
Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
Reply to: ${email}
Sent from: Stonehood Contact Form
Timestamp: ${new Date().toLocaleString()}
  `;

  return await sendEmail({
    to: recipientEmail,
    subject: `Contact Form: ${subject}`,
    html: htmlContent,
    text: textContent,
    cc: email // CC the sender so they get a copy
  });
}

module.exports = {
  sendEmail,
  sendContactEmail
};