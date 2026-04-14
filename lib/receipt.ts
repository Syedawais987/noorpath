export function generateReceiptHTML({
  invoiceId,
  studentName,
  amount,
  currency,
  paidAt,
  paymentMethod,
}: {
  invoiceId: string;
  studentName: string;
  amount: number;
  currency: string;
  paidAt: Date;
  paymentMethod: string | null;
}): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; margin: 0; padding: 40px; color: #1A1A2E; }
        .receipt { max-width: 600px; margin: 0 auto; border: 1px solid #E5E7EB; border-radius: 12px; overflow: hidden; }
        .header { background: #1B4332; color: white; padding: 24px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .header p { margin: 4px 0 0; opacity: 0.8; font-size: 14px; }
        .body { padding: 24px; }
        .row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #E5E7EB; }
        .row:last-child { border-bottom: none; }
        .label { color: #6B7280; font-size: 14px; }
        .value { font-weight: 600; font-size: 14px; }
        .total { background: #FAF7F2; padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; }
        .total .amount { font-size: 24px; font-weight: 700; color: #1B4332; }
        .footer { text-align: center; padding: 16px; color: #6B7280; font-size: 12px; }
        .badge { display: inline-block; background: #C8E6C9; color: #1B4332; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="receipt">
        <div class="header">
          <h1>NoorPath</h1>
          <p>Payment Receipt</p>
        </div>
        <div class="body">
          <div class="row">
            <span class="label">Receipt #</span>
            <span class="value">${invoiceId.slice(-8).toUpperCase()}</span>
          </div>
          <div class="row">
            <span class="label">Student</span>
            <span class="value">${studentName}</span>
          </div>
          <div class="row">
            <span class="label">Date Paid</span>
            <span class="value">${paidAt.toLocaleDateString()}</span>
          </div>
          <div class="row">
            <span class="label">Payment Method</span>
            <span class="value">${paymentMethod || "Manual"}</span>
          </div>
          <div class="row">
            <span class="label">Status</span>
            <span class="badge">PAID</span>
          </div>
        </div>
        <div class="total">
          <span class="label">Total Paid</span>
          <span class="amount">${currency} ${amount.toLocaleString()}</span>
        </div>
        <div class="footer">
          <p>Thank you for your payment. JazakAllahu Khairan.</p>
          <p>NoorPath — Quran Teaching Platform</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
