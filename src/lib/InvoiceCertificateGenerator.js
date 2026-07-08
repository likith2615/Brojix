// Brojix Document Generator (Invoice & Completion Certificate)
// Uses native browser printing for premium, pixel-perfect PDF rendering.

export const printInvoice = (project) => {
  if (!project) return;

  const invoiceWindow = window.open('', '_blank', 'width=800,height=900');
  
  const discount = Number(project.discount || 0);
  const gst = Number(project.gst || 0);
  const budget = Number(project.budget || project.totalPrice || 0);
  
  // Calculations
  const discountedAmount = budget - discount;
  const gstAmount = (discountedAmount * gst) / 100;
  const finalAmount = discountedAmount + gstAmount;
  const advancePaid = Number(project.advancePaid || 0);
  const remainingAmount = Math.max(0, finalAmount - advancePaid);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice - ${project.id}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #0b0f19;
          background: #ffffff;
          padding: 40px;
          line-height: 1.5;
        }
        .invoice-card {
          max-width: 720px;
          margin: 0 auto;
          border: 1px solid #e2e8f0;
          border-top: 8px solid #d2f000;
          padding: 40px;
          border-radius: 12px;
          position: relative;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 2px solid #f1f5f9;
          padding-bottom: 30px;
          margin-bottom: 30px;
        }
        .logo {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 28px;
          font-weight: 700;
          color: #090d16;
          letter-spacing: -0.03em;
        }
        .logo span {
          color: #b3cc00;
        }
        .company-info {
          text-align: right;
          font-size: 13px;
          color: #64748b;
        }
        .company-info h3 {
          color: #0f172a;
          font-size: 15px;
          margin-bottom: 4px;
        }
        .title-area {
          margin-bottom: 30px;
        }
        .title-area h1 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 24px;
          color: #0f172a;
          margin-bottom: 4px;
        }
        .invoice-id {
          font-family: monospace;
          color: #64748b;
          font-size: 14px;
        }
        .details-grid {
          display: grid;
          grid-template-cols: 1fr 1fr;
          gap: 30px;
          margin-bottom: 40px;
        }
        .detail-block h4 {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #94a3b8;
          margin-bottom: 8px;
        }
        .detail-block p {
          font-size: 14px;
          color: #334155;
          font-weight: 500;
        }
        .detail-block .client-name {
          font-size: 16px;
          color: #0f172a;
          font-weight: 600;
          margin-bottom: 4px;
        }
        .table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        .table th {
          text-align: left;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #94a3b8;
          padding: 12px 16px;
          border-bottom: 2px solid #e2e8f0;
          background: #f8fafc;
        }
        .table td {
          padding: 16px;
          border-bottom: 1px solid #e2e8f0;
          font-size: 14px;
          color: #334155;
        }
        .table td.qty-rate {
          color: #64748b;
        }
        .table td.amount {
          text-align: right;
          font-weight: 600;
          color: #0f172a;
        }
        .summary-block {
          width: 280px;
          margin-left: auto;
          margin-bottom: 40px;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          font-size: 14px;
          color: #64748b;
        }
        .summary-row.total {
          border-top: 2px solid #e2e8f0;
          margin-top: 8px;
          padding-top: 12px;
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
        }
        .summary-row.paid {
          color: #059669;
          font-weight: 600;
        }
        .summary-row.due {
          color: #dc2626;
          font-weight: 700;
          border-top: 1px double #e2e8f0;
          padding-top: 8px;
          font-size: 16px;
        }
        .footer-note {
          border-top: 1px solid #e2e8f0;
          padding-top: 20px;
          font-size: 12px;
          color: #94a3b8;
          text-align: center;
        }
        .status-stamp {
          position: absolute;
          top: 120px;
          right: 40px;
          border: 4px solid #059669;
          color: #059669;
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
          padding: 8px 16px;
          transform: rotate(-12deg);
          border-radius: 8px;
          opacity: 0.75;
          letter-spacing: 0.1em;
        }
        .status-stamp.pending {
          border-color: #d97706;
          color: #d97706;
        }
        .status-stamp.partially {
          border-color: #2563eb;
          color: #2563eb;
        }
        @media print {
          body {
            padding: 0;
          }
          .invoice-card {
            border: none;
            padding: 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="invoice-card">
        ${
          project.paymentStatus === 'Fully Paid' 
            ? '<div class="status-stamp">Paid</div>' 
            : project.paymentStatus === 'Partially Paid'
            ? '<div class="status-stamp pending">Partially Paid</div>'
            : '<div class="status-stamp pending">Payment Due</div>'
        }
        <div class="header">
          <div class="logo">BRO<span>JIX</span></div>
          <div class="company-info">
            <h3>BROJIX Technologies</h3>
            <p>Digital Product Studio & Dev Agency</p>
            <p>support@brojix.com | www.brojix.com</p>
          </div>
        </div>

        <div class="title-area">
          <h1>INVOICE</h1>
          <div class="invoice-id">Invoice Ref: INV-${project.id}</div>
        </div>

        <div class="details-grid">
          <div class="detail-block">
            <h4>Billed To</h4>
            <div class="client-name">${project.client_name || project.name}</div>
            ${project.company_name ? `<p>${project.company_name}</p>` : ''}
            ${project.email ? `<p>${project.email}</p>` : ''}
            ${project.phone || project.whatsapp ? `<p>+${project.phone || project.whatsapp}</p>` : ''}
          </div>
          <div class="detail-block" style="text-align: right;">
            <h4>Invoice Date</h4>
            <p>${project.start_date || (project.created_at ? new Date(project.created_at).toLocaleDateString() : new Date().toLocaleDateString())}</p>
            <h4 style="margin-top: 15px;">Target Delivery</h4>
            <p>${project.expected_delivery || project.deadline || 'N/A'}</p>
          </div>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Service Mode</th>
              <th style="text-align: right;">Amount (INR)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>${project.topic || 'Software Project Service'}</strong>
                <div style="font-size: 12px; color: #64748b; margin-top: 4px;">
                  ${project.requirements || project.prdText || 'Custom software design & implementation.'}
                </div>
              </td>
              <td>${project.project_type || project.service || 'Development'}</td>
              <td class="amount">₹${budget.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>

        <div class="summary-block">
          <div class="summary-row">
            <span>Subtotal</span>
            <span>₹${budget.toLocaleString()}</span>
          </div>
          ${discount > 0 ? `
          <div class="summary-row" style="color: #059669;">
            <span>Discount Applied</span>
            <span>-₹${discount.toLocaleString()}</span>
          </div>
          ` : ''}
          ${gst > 0 ? `
          <div class="summary-row">
            <span>GST (${gst}%)</span>
            <span>₹${gstAmount.toLocaleString()}</span>
          </div>
          ` : ''}
          <div class="summary-row total">
            <span>Total Value</span>
            <span>₹${finalAmount.toLocaleString()}</span>
          </div>
          <div class="summary-row paid">
            <span>Advance Paid</span>
            <span>₹${advancePaid.toLocaleString()}</span>
          </div>
          <div class="summary-row due">
            <span>Balance Due</span>
            <span>₹${remainingAmount.toLocaleString()}</span>
          </div>
        </div>

        <div class="footer-note">
          <p>Thank you for collaborating with BROJIX. We build products that scale.</p>
          <p style="margin-top: 4px; font-size: 10px;">This is a computer-generated billing statement and requires no manual signature.</p>
        </div>
      </div>
      <script>
        window.onload = function() {
          window.print();
        }
      </script>
    </body>
    </html>
  `;

  invoiceWindow.document.write(htmlContent);
  invoiceWindow.document.close();
};

export const printCertificate = (project) => {
  if (!project) return;

  const certWindow = window.open('', '_blank', 'width=900,height=650');
  
  const completionDate = project.actual_delivery || project.expected_delivery || project.deadline || new Date().toLocaleDateString();

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Certificate of Completion - ${project.id}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;1,400&display=swap');
        
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #090d16;
          color: #f8fafc;
          padding: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
        }
        .cert-container {
          width: 800px;
          height: 550px;
          background: #0f172a;
          border: 10px solid #1e293b;
          border-radius: 8px;
          padding: 40px;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          text-align: center;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          overflow: hidden;
        }
        /* Glowing neon borders matching Brojix */
        .cert-container::before {
          content: '';
          position: absolute;
          inset: 0;
          border: 2px solid #d2f000;
          margin: 6px;
          border-radius: 4px;
          pointer-events: none;
          opacity: 0.6;
        }
        /* Ambient glows */
        .glow-1 {
          position: absolute;
          top: -100px;
          left: -100px;
          width: 300px;
          height: 300px;
          background: rgba(210, 240, 0, 0.03);
          border-radius: 50%;
          filter: blur(80px);
        }
        .glow-2 {
          position: absolute;
          bottom: -100px;
          right: -100px;
          width: 300px;
          height: 300px;
          background: rgba(210, 240, 0, 0.03);
          border-radius: 50%;
          filter: blur(80px);
        }
        .header {
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 10;
        }
        .logo {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 28px;
          font-weight: 700;
          color: #f8fafc;
          letter-spacing: -0.03em;
          margin-bottom: 10px;
        }
        .logo span {
          color: #d2f000;
        }
        .subtitle {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          color: #94a3b8;
        }
        .main-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 36px;
          font-weight: 700;
          color: #d2f000;
          letter-spacing: 0.05em;
          margin-top: 10px;
          z-index: 10;
        }
        .award-text {
          font-size: 13px;
          color: #94a3b8;
          margin-top: 10px;
          z-index: 10;
        }
        .recipient-name {
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          font-weight: 600;
          color: #ffffff;
          margin: 15px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding-bottom: 5px;
          min-width: 300px;
          z-index: 10;
        }
        .project-details {
          font-size: 15px;
          color: #cbd5e1;
          max-width: 580px;
          line-height: 1.6;
          z-index: 10;
        }
        .project-details strong {
          color: #d2f000;
          font-weight: 600;
        }
        .meta-area {
          display: flex;
          justify-content: space-between;
          width: 100%;
          padding: 0 40px;
          margin-top: 20px;
          z-index: 10;
        }
        .signature-block {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .sig-line {
          width: 150px;
          border-top: 1px solid #475569;
          margin-top: 30px;
          padding-top: 5px;
        }
        .sig-text {
          font-size: 11px;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        .sig-title {
          font-size: 12px;
          color: #cbd5e1;
          font-weight: 600;
        }
        .stamp-container {
          position: absolute;
          bottom: 120px;
          right: 70px;
          width: 90px;
          height: 90px;
          border: 2px dashed rgba(210, 240, 0, 0.3);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: rotate(15deg);
        }
        .stamp-inner {
          width: 78px;
          height: 78px;
          border: 2px solid rgba(210, 240, 0, 0.6);
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-size: 8px;
          font-weight: 700;
          color: #d2f000;
          text-transform: uppercase;
        }
        @media print {
          body {
            background: #ffffff;
            color: #090d16;
            padding: 0;
          }
          .cert-container {
            box-shadow: none;
            border-color: #334155;
            background: #0f172a !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      </style>
    </head>
    <body>
      <div class="cert-container">
        <div class="glow-1"></div>
        <div class="glow-2"></div>
        
        <div class="header">
          <div class="logo">BRO<span>JIX</span></div>
          <div class="subtitle">Certificate of Excellence</div>
        </div>

        <div>
          <div class="main-title">PROJECT HANDOVER</div>
          <div class="award-text">This is proudly presented to</div>
          <div class="recipient-name">${project.client_name || project.name}</div>
          <div class="project-details">
            In recognition of the successful completion and delivery of the product<br/>
            <strong>"${project.topic || 'Custom Digital Solution'}"</strong><br/>
            architected and executed with excellence by the BROJIX Engineering Team.
          </div>
        </div>

        <div class="stamp-container">
          <div class="stamp-inner">
            <span>Verified</span>
            <span style="font-size: 6px; margin: 2px 0;">BROJIX</span>
            <span>Delivery</span>
          </div>
        </div>

        <div class="meta-area">
          <div class="signature-block" style="align-items: flex-start;">
            <p style="font-size: 13px; font-weight: 500;">Handover Date</p>
            <p style="font-size: 13px; color: #d2f000; font-family: monospace; font-weight: 600; margin-top: 4px;">${completionDate}</p>
          </div>
          
          <div class="signature-block">
            <div style="font-family: 'Playfair Display', serif; font-style: italic; font-size: 18px; color: #d2f000;">C. Likith Kumar</div>
            <div class="sig-line"></div>
            <div class="sig-text">Founder & Director</div>
            <div class="sig-title">BROJIX</div>
            <div style="font-size: 9px; color: #94a3b8; margin-top: 4px; font-style: italic;">(Its from C Likith Kumar)</div>
          </div>
        </div>
      </div>
      <script>
        window.onload = function() {
          window.print();
        }
      </script>
    </body>
    </html>
  `;

  certWindow.document.write(htmlContent);
  certWindow.document.close();
};
