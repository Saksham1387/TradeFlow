import { OauthTokenModel } from "db/client";
import { google } from "googleapis";

// You should replace this with your DB fetch
async function getUserGmailCredentials(userId: string) {
  const oauth = await OauthTokenModel.findOne({
    userId,
    provider:"GOOGLE"
  })
  return {
    accessToken: oauth?.accessToken,
    refreshToken: oauth?.refreshToken,
  };
}

export const executeGmailAction = async (
  sendTo: string,
  subject: string,
  content: string,
  userId: string
) => {
  try {
    // 1️⃣ Get stored credentials for this user
    const creds = await getUserGmailCredentials(userId);

    if (!creds) {
      throw new Error("Gmail credentials not found for user");
    }

    // 2️⃣ Setup OAuth client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    oauth2Client.setCredentials({
      access_token: creds.accessToken,
      refresh_token: creds.refreshToken,
    });

    // 3️⃣ Auto refresh if expired
    await oauth2Client.getAccessToken();

    const gmail = google.gmail({
      version: "v1",
      auth: oauth2Client,
    });

    // 4️⃣ Build email
    const message = [
      `To: ${sendTo}`,
      `Subject: ${subject}`,
      "Content-Type: text/plain; charset=utf-8",
      "",
      content,
    ].join("\n");

    console.log({
        sendTo,
        subject,
        content,
      });
    const encodedMessage = Buffer.from(message)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    // 5️⃣ Send email
    const res = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedMessage,
      },
    });

    return {
      success: true,
      messageId: res.data.id,
    };
  } catch (error: any) {
    console.log(error)
    return {
      success: false,
      error: error.message,
    };
  }
};