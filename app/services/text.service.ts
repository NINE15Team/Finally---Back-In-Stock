
import invariant from "tiny-invariant";
import { TextDTO } from "~/dto/text.dto";

const sendSMS = async (textDTO: TextDTO) => {
  invariant(process.env.TWILIO_SMS_SID, "Twilio SMS SID must be set");
  invariant(process.env.TWILIO_SMS_AUTH_TOKEN, "Twilio sms auth token must be set");
  invariant(process.env.TWILIO_SMS_FROM, "Twilio sms from must be set");
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = require('twilio')(accountSid, authToken);

  return client.messages
    .create({
      body: textDTO.body,
      from: process.env.TWILIO_SMS_FROM,
      to: textDTO.to
    })
};




export { sendSMS };
