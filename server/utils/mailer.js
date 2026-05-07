const nodemailer = require('nodemailer');

// Set up the transporter using standard SMTP (configured for Gmail usually)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendInviteEmail = async (toEmail, groupName, inviteLink) => {
  // If the user hasn't set up real credentials, simulate the email send
  if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'your_gmail@gmail.com') {
    console.log('\n=============================================');
    console.log(`[SIMULATED EMAIL] To: ${toEmail}`);
    console.log(`Subject: You're invited to join "${groupName}" on Expense Splitter`);
    console.log(`Link: ${inviteLink}`);
    console.log('=============================================\n');
    return 'simulated';
  }

  try {
    const mailOptions = {
      from: `"Expense Splitter" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: `You're invited to join "${groupName}" on Expense Splitter`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
          <h2 style="color: #4f46e5;">Expense Splitter Invitation</h2>
          <p>Hello!</p>
          <p>You have been invited to join the group <strong>${groupName}</strong> to split expenses.</p>
          <p>Click the button below to join the group and start tracking expenses together.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${inviteLink}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Join Group</a>
          </div>
          <p style="color: #64748b; font-size: 14px;">If the button doesn't work, copy and paste this link into your browser: <br>${inviteLink}</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};
