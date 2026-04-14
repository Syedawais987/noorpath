const WHATSAPP_TOKEN = process.env.META_WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.META_WHATSAPP_PHONE_NUMBER_ID;

interface SendWhatsAppOptions {
  to: string;
  templateName: string;
  variables: string[];
}

export async function sendWhatsApp({ to, templateName, variables }: SendWhatsAppOptions) {
  if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
    console.log(`[DEV] WhatsApp to ${to}: template=${templateName}, vars=${JSON.stringify(variables)}`);
    return;
  }

  // Clean phone number (remove spaces, dashes, plus)
  const cleanPhone = to.replace(/[\s\-+]/g, "");

  try {
    const res = await fetch(
      `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: cleanPhone,
          type: "template",
          template: {
            name: templateName,
            language: { code: "en" },
            components: variables.length > 0
              ? [
                  {
                    type: "body",
                    parameters: variables.map((v) => ({
                      type: "text",
                      text: v,
                    })),
                  },
                ]
              : undefined,
          },
        }),
      },
    );

    if (!res.ok) {
      console.error("WhatsApp API error:", await res.text());
    }
  } catch (error) {
    console.error("Failed to send WhatsApp:", error);
  }
}

export async function sendBroadcastWhatsApp(
  recipients: { phone: string; name: string }[],
  templateName: string,
) {
  for (const r of recipients) {
    await sendWhatsApp({
      to: r.phone,
      templateName,
      variables: [r.name],
    });
  }
}
