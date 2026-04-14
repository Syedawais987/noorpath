import { Resend } from "resend";
import { escapeHtml } from "@/lib/utils";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = "NoorPath <noreply@noorpath.com>";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  if (!resend) {
    console.log(`[DEV] Email to ${to}: ${subject}`);
    return;
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}

// --- Email templates ---

export function enrollmentConfirmationEmail(name: string) {
  const n = escapeHtml(name);
  return {
    subject: "Enrollment Received — NoorPath",
    html: `
      <h2>Assalamu Alaikum ${n},</h2>
      <p>Thank you for enrolling at NoorPath! Your application has been received and is under review.</p>
      <p>Alma will review your enrollment and get back to you within 24 hours.</p>
      <p>JazakAllahu Khairan,<br/>NoorPath Team</p>
    `,
  };
}

export function enrollmentApprovedEmail(name: string, setPasswordUrl: string) {
  const n = escapeHtml(name);
  const url = encodeURI(setPasswordUrl);
  return {
    subject: "Enrollment Approved — Welcome to NoorPath!",
    html: `
      <h2>Assalamu Alaikum ${n},</h2>
      <p>Great news! Your enrollment at NoorPath has been approved.</p>
      <p>Please set your password to access your dashboard:</p>
      <p><a href="${url}" style="display:inline-block;padding:12px 24px;background:#1B4332;color:white;text-decoration:none;border-radius:8px;">Set Your Password</a></p>
      <p>This link expires in 48 hours.</p>
      <p>JazakAllahu Khairan,<br/>NoorPath Team</p>
    `,
  };
}

export function enrollmentRejectedEmail(name: string, reason?: string) {
  const n = escapeHtml(name);
  return {
    subject: "Enrollment Update — NoorPath",
    html: `
      <h2>Assalamu Alaikum ${n},</h2>
      <p>Thank you for your interest in NoorPath. Unfortunately, your enrollment was not approved at this time.</p>
      ${reason ? `<p><strong>Reason:</strong> ${escapeHtml(reason)}</p>` : ""}
      <p>If you have questions, please reach out via WhatsApp.</p>
      <p>JazakAllahu Khairan,<br/>NoorPath Team</p>
    `,
  };
}

export function sessionScheduledEmail(name: string, date: string, time: string) {
  const n = escapeHtml(name);
  return {
    subject: "New Class Scheduled — NoorPath",
    html: `
      <h2>Assalamu Alaikum ${n},</h2>
      <p>A new class has been scheduled for you:</p>
      <p><strong>Date:</strong> ${escapeHtml(date)}<br/><strong>Time:</strong> ${escapeHtml(time)}</p>
      <p>You can join the class from your dashboard 10 minutes before the session.</p>
      <p>JazakAllahu Khairan,<br/>NoorPath Team</p>
    `,
  };
}

export function sessionReminderEmail(name: string, date: string, time: string) {
  const n = escapeHtml(name);
  return {
    subject: "Class Reminder — NoorPath",
    html: `
      <h2>Assalamu Alaikum ${n},</h2>
      <p>Reminder: You have a class coming up!</p>
      <p><strong>Date:</strong> ${escapeHtml(date)}<br/><strong>Time:</strong> ${escapeHtml(time)}</p>
      <p>Join from your dashboard when it's time.</p>
      <p>JazakAllahu Khairan,<br/>NoorPath Team</p>
    `,
  };
}

export function assignmentPostedEmail(name: string, title: string) {
  const n = escapeHtml(name);
  const t = escapeHtml(title);
  return {
    subject: `New Assignment: ${title} — NoorPath`,
    html: `
      <h2>Assalamu Alaikum ${n},</h2>
      <p>A new assignment has been posted: <strong>${t}</strong></p>
      <p>View and submit it from your dashboard.</p>
      <p>JazakAllahu Khairan,<br/>NoorPath Team</p>
    `,
  };
}

export function assignmentFeedbackEmail(name: string, title: string, status: string) {
  const n = escapeHtml(name);
  const t = escapeHtml(title);
  return {
    subject: `Assignment Feedback: ${title} — NoorPath`,
    html: `
      <h2>Assalamu Alaikum ${n},</h2>
      <p>Your assignment <strong>${t}</strong> has been reviewed.</p>
      <p><strong>Status:</strong> ${escapeHtml(status)}</p>
      <p>Check your dashboard for detailed feedback.</p>
      <p>JazakAllahu Khairan,<br/>NoorPath Team</p>
    `,
  };
}

export function invoiceCreatedEmail(name: string, amount: string, dueDate: string) {
  const n = escapeHtml(name);
  return {
    subject: "New Invoice — NoorPath",
    html: `
      <h2>Assalamu Alaikum ${n},</h2>
      <p>A new invoice has been created for you:</p>
      <p><strong>Amount:</strong> ${escapeHtml(amount)}<br/><strong>Due Date:</strong> ${escapeHtml(dueDate)}</p>
      <p>View and pay from your dashboard.</p>
      <p>JazakAllahu Khairan,<br/>NoorPath Team</p>
    `,
  };
}
