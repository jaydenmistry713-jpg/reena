// netlify/functions/form-submission.js

// Explicitly require nodemailer at the top
let nodemailer;
try {
  nodemailer = require('nodemailer');
} catch (err) {
  console.error('Failed to load nodemailer:', err);
}

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Check if nodemailer loaded
  if (!nodemailer) {
    console.error('Nodemailer not available');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Email service not configured' })
    };
  }

  try {
    // Parse form data
    const data = JSON.parse(event.body);

    // --- Additive: persist the inquiry to Netlify Blobs ---------------------
    // This runs BEFORE the email so an email failure can't stop the save, and
    // it is fully wrapped so a blob failure can't break the email flow.
    try {
      const { getStore } = await import('@netlify/blobs');
      const crypto = require('crypto');

      // Automatic config on Git/CLI deploys; explicit credentials otherwise
      // (manual drag-and-drop deploys don't auto-provision Blobs).
      const _siteID = process.env.NETLIFY_SITE_ID || process.env.BLOBS_SITE_ID;
      const _token = process.env.NETLIFY_BLOBS_TOKEN || process.env.BLOBS_TOKEN;
      const inquiries = (_siteID && _token)
        ? getStore({ name: 'inquiries', siteID: _siteID, token: _token })
        : getStore('inquiries');

      const createdAt = new Date().toISOString();
      const id = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;

      const record = {
        id,
        createdAt,
        status: 'new',
        name: data.name,
        email: data.email,
        phone: data.phone,
        'event-type': data['event-type'],
        'event-date': data['event-date'],
        'event-time': data['event-time'],
        venue: data.venue,
        'event-location': data['event-location'],
        'number-of-guests': data['number-of-guests'],
        message: data.message
      };

      await inquiries.setJSON(id, record);
    } catch (blobErr) {
      // Never let a storage problem affect the email notification.
      console.error('Failed to save inquiry to Blobs (email will still send):', blobErr);
    }
    // -----------------------------------------------------------------------

    // Email template with light theme and gray boxes
    const emailHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Enquiry from Punjabi Folk Entertainment Ltd</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #ffffff;">
    
    <table role="presentation" style="width: 100%; max-width: 600px; margin: 20px auto; background-color: #ffffff; border-collapse: collapse;">
        <tr>
            <td style="padding: 30px;">
                
                <h2 style="color: #333333; margin-bottom: 30px; font-size: 20px;">Enquiry from Punjabi Folk Entertainment Ltd</h2>
                
                <div style="margin-bottom: 15px;">
                    <div style="color: #666666; font-size: 13px; margin-bottom: 5px; font-weight: 600;">
                        Your Name
                    </div>
                    <div style="background-color: #f5f5f5; padding: 12px 15px; border-radius: 4px; color: #333333; font-size: 15px;">
                        ${data.name}
                    </div>
                </div>

                <div style="margin-bottom: 15px;">
                    <div style="color: #666666; font-size: 13px; margin-bottom: 5px; font-weight: 600;">
                        Your Number
                    </div>
                    <div style="background-color: #f5f5f5; padding: 12px 15px; border-radius: 4px; color: #333333; font-size: 15px;">
                        ${data.phone}
                    </div>
                </div>

                <div style="margin-bottom: 15px;">
                    <div style="color: #666666; font-size: 13px; margin-bottom: 5px; font-weight: 600;">
                        Email
                    </div>
                    <div style="background-color: #f5f5f5; padding: 12px 15px; border-radius: 4px;">
                        <a href="mailto:${data.email}" style="color: #0066cc; text-decoration: none; font-size: 15px;">${data.email}</a>
                    </div>
                </div>

                <div style="margin-bottom: 15px;">
                    <div style="color: #666666; font-size: 13px; margin-bottom: 5px; font-weight: 600;">
                        Type of Event
                    </div>
                    <div style="background-color: #f5f5f5; padding: 12px 15px; border-radius: 4px; color: #333333; font-size: 15px;">
                        ${data['event-type']}
                    </div>
                </div>

                <div style="margin-bottom: 15px;">
                    <div style="color: #666666; font-size: 13px; margin-bottom: 5px; font-weight: 600;">
                        Event Date
                    </div>
                    <div style="background-color: #f5f5f5; padding: 12px 15px; border-radius: 4px; color: #333333; font-size: 15px;">
                        ${data['event-date']}
                    </div>
                </div>

                <div style="margin-bottom: 15px;">
                    <div style="color: #666666; font-size: 13px; margin-bottom: 5px; font-weight: 600;">
                        Event Time
                    </div>
                    <div style="background-color: #f5f5f5; padding: 12px 15px; border-radius: 4px; color: #333333; font-size: 15px;">
                        ${data['event-time']}
                    </div>
                </div>

                <div style="margin-bottom: 15px;">
                    <div style="color: #666666; font-size: 13px; margin-bottom: 5px; font-weight: 600;">
                        Estimated Number of Guests
                    </div>
                    <div style="background-color: #f5f5f5; padding: 12px 15px; border-radius: 4px; color: #333333; font-size: 15px;">
                        ${data['number-of-guests']}
                    </div>
                </div>

                <div style="margin-bottom: 15px;">
                    <div style="color: #666666; font-size: 13px; margin-bottom: 5px; font-weight: 600;">
                        Type of Venue
                    </div>
                    <div style="background-color: #f5f5f5; padding: 12px 15px; border-radius: 4px; color: #333333; font-size: 15px;">
                        ${data.venue || 'Not specified'}
                    </div>
                </div>

                <div style="margin-bottom: 15px;">
                    <div style="color: #666666; font-size: 13px; margin-bottom: 5px; font-weight: 600;">
                        Event Location
                    </div>
                    <div style="background-color: #f5f5f5; padding: 12px 15px; border-radius: 4px; color: #333333; font-size: 15px;">
                        ${data['event-location']}
                    </div>
                </div>

                <div style="margin-bottom: 15px;">
                    <div style="color: #666666; font-size: 13px; margin-bottom: 5px; font-weight: 600;">
                        Additional Information
                    </div>
                    <div style="background-color: #f5f5f5; padding: 12px 15px; border-radius: 4px; color: #333333; font-size: 15px; line-height: 1.6;">
                        ${data.message || 'No additional message'}
                    </div>
                </div>

            </td>
        </tr>
    </table>

    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 20px; text-align: center; color: #999999; font-size: 12px;">
                <p style="margin: 0;">This enquiry was submitted via the contact form at punjabifolkentertainment.com</p>
            </td>
        </tr>
    </table>
</body>
</html>
    `;

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Send email
    await transporter.sendMail({
      from: '"Punjabi Folk Entertainment - Website" <' + process.env.EMAIL_USER + '>',
      replyTo: data.email,
      to: 'info@punjabifolkentertainment.com',
      subject: `New Enquiry from ${data.name} - ${data['event-type']}`,
      html: emailHTML
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Form submitted successfully!' })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process form submission', details: error.message })
    };
  }
};
