import sgMail from '@sendgrid/mail';

const sendEmail = async ({ to, subject, html, from, isMultiple, personalizations }) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    from: from || process.env.SENDGRID_FROM_EMAIL,
    subject,
    html,
  };
  
  if (personalizations) {
    msg.personalizations = personalizations;
  } else if (to) {
    msg.to = to;
    if (isMultiple) {
      msg.isMultiple = true;
    }
  }

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error('Error sending email via SendGrid', error);
    if (error.response) {
      console.error(error.response.body);
    }
    throw error;
  }
};

export default sendEmail;
