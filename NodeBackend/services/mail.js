const nodemailer = require("nodemailer");
const validator = require("validator");
const path = require("path");

const createTransport = () => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL,
      pass: process.env.MAIL_PASSWORD,
    },
  });
  return transporter;
};

const bodyContent = (
  user_name
) => `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html
  xmlns:o="urn:schemas-microsoft-com:office:office"
  xmlns:v="urn:schemas-microsoft-com:vml"
  lang="en"
>
  <head>
    <link
      rel="stylesheet"
      type="text/css"
      hs-webfonts="true"
      href="https://fonts.googleapis.com/css?family=Lato|Lato:i,b,bi"
    />
    <title></title>
    <meta property="og:title" content="Email template" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <style type="text/css">
      a {
        text-decoration: underline;
        color: inherit;
        font-weight: bold;
        color: #253342;
      }

      h1 {
        font-size: 56px;
      }

      h2 {
        font-size: 28px;
        font-weight: 900;
      }

      p {
        font-weight: 100;
      }

      td {
        vertical-align: top;
      }

      #email {
        margin: auto;
        width: 600px;
        background-color: white;
      }

      button {
        font: inherit;
        background-color: #ff7a59;
        border: none;
        padding: 10px;
        text-transform: capitalize;
        letter-spacing: 2px;
        font-weight: 900;
        color: white;
        border-radius: 5px;
        box-shadow: 3px 3px #d94c53;
      }

      button > a {
        text-decoration: none;
        color:white !important;
      }

      .subtle-link {
        font-size: 9px;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: #cbd6e2;
      }
    </style>
  </head>

  <body
    style="
      background-color: #f5f8fa;
      width: 100%;
      margin: auto 0;
      padding: 0;
      font-family: Lato, sans-serif;
      font-size: 18px;
      color: #33475b;
      word-break: break-word;
    "
  >
    <div id="email">
      <table role="presentation" width="100%">
        <tr>
          <td style="color: black; background-color: white; text-align: center">
            <img
              alt="Flower"
              src="https://i.postimg.cc/X77Tpz4C/mail-image.jpg"
              width="400px"
            />
          </td>
        </tr>
      </table>

      <table
        role="presentation"
        cellpadding="0"
        cellspacing="10px"
        style="padding: 30px 30px 30px 60px; border: 0%"
      >
        <tr>
          <td>
            <h2>${user_name} invite in chat-app chat</h2>
            <p>
              There is world famous chat application with provides ease of
              access to any user of application and you can directly chat
              without further subscription headache of other apps
            </p>
            <button><a href="${process.env.APP_URL}">Visit</a></button>
          </td>
        </tr>
      </table>

      <table width="100%" style="background-color: #f5f8fa">
        <tr>
          <td style="padding: 30px 30px; float: left">
            <p style="color: #99acc2">Made with &hearts; at HubSpot HQ</p>
            <a class="subtle-link" href="#"> Unsubscribe </a>
          </td>
        </tr>
      </table>
    </div>
  </body>
</html>
`;

// {"accepted":["dudis.vision@gmail.com"],"rejected":[],"ehlo":["SIZE 35882577","8BITMIME","AUTH LOGIN PLAIN XOAUTH2 PLAIN-CLIENTTOKEN OAUTHBEARER XOAUTH","ENHANCEDSTATUSCODES","PIPELINING","CHUNKING","SMTPUTF8"],"envelopeTime":1122,"messageTime":851,"messageSize":311,"response":"250 2.0.0 OK  1711439216 u16-20020a17090a0c5000b0029de90f4d44sm12603786pje.9 - gsmtp","envelope":{"from":"webchatapp09@gmail.com","to":["dudis.vision@gmail.com"]},"messageId":"<5054548d-7a3d-8c2f-8a94-7d9ed00dd91f@gmail.com>"}
const sendMail = async (reciever, user_name) => {
  if (!reciever || !validator.isEmail(reciever)) {
    let error = new Error("please provide valid email!");
    error.statusCode = 422;
    throw error;
  }

  const transporter = createTransport(); //to initialize env variable we have to invoke here

  const mailOptions = {
    from: process.env.MAIL,
    to: reciever,
    subject: `has invited you for chat`,
    html: bodyContent(user_name),
  };

  const info = await transporter.sendMail(mailOptions);
  return {
    accepted: info.accepted,
    rejected: info.rejected,
    response: info.response,
  };
};

module.exports = sendMail;
