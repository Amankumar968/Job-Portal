import { Webhook } from "svix";
import User from "../models/User.js";

export const clerkWebhooks = async (req, res) => {
  // req.body is a Buffer because of express.raw()
  console.log("🔔 Clerk webhook received");
  const payloadBuffer = req.body;
  const payloadString = payloadBuffer.toString("utf8");

  const svixId = req.get("svix-id");
  const svixTimestamp = req.get("svix-timestamp");
  const svixSignature = req.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return res.status(400).send("Missing Svix headers");
  }

  let event;
  try {
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    // Verify signature using the **exact** raw string
    event = wh.verify(payloadString, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    });
    // Some versions return object already; this keeps it safe:
    if (typeof event === "string") event = JSON.parse(event);
  } catch (err) {
    console.error("❌ Clerk webhook verify failed:", err.message);
    return res.status(400).send("Invalid signature");
  }

  const { type, data } = event;
  console.log("✅ Clerk event:", type, data?.id);

  try {
    if (type === "user.created" || type === "user.updated") {
      const primaryEmail =
        data.email_addresses?.find(e => e.id === data.primary_email_address_id)?.email_address ||
        data.email_addresses?.[0]?.email_address ||
        null;

      const doc = {
        clerkId: data.id,
        email: primaryEmail,
        name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
        image: data.image_url || "",
        resume: "",
      };

      await User.findOneAndUpdate(
        { clerkId: data.id },
        doc,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    if (type === "user.deleted") {
      await User.findOneAndUpdate(
        { clerkId: data.id },
        { $set: { deletedAt: new Date(), isActive: false } }
      );
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("❌ Webhook handler error:", err);
    return res.status(500).json({ ok: false });
  }
};
