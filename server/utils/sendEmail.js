import sgMail from '@sendgrid/mail';

const sendEmail = async ({ to, subject, html }) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject,
    html,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error('Error sending email via SendGrid', error);
    if (error.response) {
      console.error(error.response.body);
    }
  }
};

export default sendEmail;
