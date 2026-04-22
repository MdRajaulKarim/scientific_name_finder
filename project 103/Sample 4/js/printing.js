/**
 * ZestyBite — printing.js
 * Thermal Receipt Printer Support
 *
 * Supports two methods:
 *  A) Browser Print (window.print with @media print CSS)
 *     Works with any printer including thermal via browser driver.
 *  B) ESC/POS Raw Commands via BrowserPrint / Star Micronics SDK
 *     For direct thermal printer integration without a print dialog.
 *
 * Configuration:
 *  - Set PRINTER_WIDTH to '58mm' or '80mm'
 *  - For USB/Bluetooth thermal printers, enable ESCPOS_MODE = true
 *    and install the required driver/SDK.
 */

/* ============================================================
   CONFIG
   ============================================================ */
const PRINTER_CONFIG = {
  width:       '80mm',     // '58mm' or '80mm'
  charset:     'UTF-8',
  restaurant:  'ZestyBite',
  address:     '42, Foodie Lane, MG Road, Bengaluru — 560001',
  phone:       '+91 98765 43210',
  gst:         'GSTIN: 29XXXXX1234Z1ZX',
  footer1:     'Thank you for dining with us!',
  footer2:     'Visit us at zestybite.com',
  escpos_mode: false       // Set true for direct ESC/POS
};

/* ============================================================
   1. MAIN ENTRY — printReceipt(order)
   Called automatically after successful payment.
   Can also be called manually from Admin panel.
   ============================================================ */
function printReceipt(order) {
  if (!order) { console.error('[Print] No order provided'); return; }

  if (PRINTER_CONFIG.escpos_mode) {
    printViaESCPOS(order);
  } else {
    printViaBrowser(order);
  }
}

/* ============================================================
   2. METHOD A — Browser Print
   Opens a pre-formatted print window sized for thermal paper.
   ============================================================ */
function printViaBrowser(order) {
  const html = buildReceiptHTML(order);
  const win  = window.open('', 'ZestyBite_Receipt', `width=400,height=700`);

  win.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Receipt #${order.id}</title>
  <style>
    /* ── Thermal Paper Styles ── */
    @page {
      size: ${PRINTER_CONFIG.width} auto;
      margin: 4mm 2mm;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Courier New', Courier, monospace;
      font-size: 11px;
      color: #000;
      background: #fff;
      width: ${PRINTER_CONFIG.width === '58mm' ? '52mm' : '72mm'};
      padding: 2mm;
      line-height: 1.5;
    }
    .center   { text-align: center; }
    .right    { text-align: right; }
    .bold     { font-weight: bold; }
    .large    { font-size: 15px; font-weight: bold; }
    .divider  { border-top: 1px dashed #000; margin: 4px 0; }
    .divider-solid { border-top: 1px solid #000; margin: 4px 0; }
    .row      { display: flex; justify-content: space-between; }
    .total-row { display: flex; justify-content: space-between; font-weight: bold; font-size: 13px; }
    .spacer   { height: 6px; }
    .barcode  { text-align: center; font-size: 9px; letter-spacing: 3px; margin-top: 4px; }

    @media print {
      body { -webkit-print-color-adjust: exact; }
    }
  </style>
</head>
<body>${html}</body>
</html>`);

  win.document.close();

  // Auto-trigger print dialog
  win.onload = () => {
    win.focus();
    win.print();
    win.onafterprint = () => win.close();
  };
}

/* ============================================================
   3. BUILD RECEIPT HTML (shared by both methods)
   ============================================================ */
function buildReceiptHTML(order) {
  const now        = new Date();
  const dateStr    = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeStr    = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  const subtotal   = order.items.reduce((s, i) => s + i.price * i.qty, 0);
  const delivery   = order.delivery || (subtotal > 400 ? 0 : 40);
  const taxes      = Math.round(subtotal * 0.05);
  const total      = subtotal + delivery + taxes;

  const itemsHTML  = order.items.map(item => `
    <div class="row">
      <span>${item.name.substring(0, 22)}</span>
      <span>${item.qty} x ₹${item.price}</span>
    </div>
    <div class="row" style="font-size:10px;">
      <span></span>
      <span>= ₹${item.price * item.qty}</span>
    </div>
  `).join('');

  const barcodeVal = generateBarcode(order.id);

  return `
    <!-- HEADER -->
    <div class="center large">${PRINTER_CONFIG.restaurant}</div>
    <div class="center" style="font-size:9px;">${PRINTER_CONFIG.address}</div>
    <div class="center" style="font-size:9px;">📞 ${PRINTER_CONFIG.phone}</div>
    <div class="center" style="font-size:9px;">${PRINTER_CONFIG.gst}</div>
    <div class="divider-solid"></div>

    <!-- ORDER META -->
    <div class="row bold"><span>Order ID:</span><span>#${order.id}</span></div>
    <div class="row"><span>Date:</span><span>${dateStr}</span></div>
    <div class="row"><span>Time:</span><span>${timeStr}</span></div>
    <div class="row"><span>Type:</span><span>${order.orderType || 'Delivery'}</span></div>
    ${order.phone ? `<div class="row"><span>Customer:</span><span>${order.phone}</span></div>` : ''}
    <div class="divider"></div>

    <!-- ITEMS -->
    <div class="bold" style="margin-bottom:3px;">ITEMS</div>
    ${itemsHTML}
    <div class="divider"></div>

    <!-- TOTALS -->
    <div class="row"><span>Subtotal</span><span>₹${subtotal}</span></div>
    <div class="row"><span>Delivery</span><span>${delivery === 0 ? 'FREE' : '₹' + delivery}</span></div>
    <div class="row"><span>GST (5%)</span><span>₹${taxes}</span></div>
    <div class="divider-solid"></div>
    <div class="total-row"><span>TOTAL</span><span>₹${total}</span></div>
    <div class="spacer"></div>

    <!-- PAYMENT -->
    <div class="row" style="font-size:10px;">
      <span>Payment:</span>
      <span>${order.paymentId ? 'Online (Paid)' : 'Cash on Delivery'}</span>
    </div>
    ${order.paymentId ? `<div class="right" style="font-size:9px;">TxnID: ${order.paymentId.slice(-8)}</div>` : ''}
    <div class="divider"></div>

    <!-- BARCODE (text representation) -->
    <div class="barcode">
      <div style="font-size:14px;">||||| ${barcodeVal} |||||</div>
      <div>#${order.id}</div>
    </div>
    <div class="spacer"></div>

    <!-- FOOTER -->
    <div class="center divider"></div>
    <div class="center bold">${PRINTER_CONFIG.footer1}</div>
    <div class="center" style="font-size:9px;">${PRINTER_CONFIG.footer2}</div>
    <div class="spacer"></div>
    <div class="spacer"></div>
  `;
}

/* ============================================================
   4. METHOD B — ESC/POS Raw Commands
   For direct thermal printers (USB/BT/Network).
   Requires a WebUSB / Star SDK / node-thermal-printer on server.
   ============================================================ */
function printViaESCPOS(order) {
  // ── If running in Electron / Node context with direct serial access ──
  // Send ESC/POS commands via window.ipc or WebSocket to server

  const commands = buildESCPOSCommands(order);

  // Option A: via server WebSocket
  sendESCPOSToServer(commands);

  // Option B: via WebUSB (browser native — requires HTTPS + user gesture)
  // printViaWebUSB(commands);
}

/** Build ESC/POS byte commands for the order */
function buildESCPOSCommands(order) {
  // ESC/POS constants
  const ESC  = '\x1B';
  const GS   = '\x1D';
  const INIT = ESC + '@';
  const CUT  = GS + 'V' + '\x41' + '\x03';   // Full cut after 3 dots feed

  const BOLD_ON  = ESC + 'E' + '\x01';
  const BOLD_OFF = ESC + 'E' + '\x00';
  const ALIGN_C  = ESC + 'a' + '\x01';
  const ALIGN_L  = ESC + 'a' + '\x00';
  const ALIGN_R  = ESC + 'a' + '\x02';
  const LARGE    = GS  + '!' + '\x11';        // Double width + height
  const NORMAL   = GS  + '!' + '\x00';
  const LINE_FEED = '\n';

  const W58 = PRINTER_CONFIG.width === '58mm' ? 32 : 48;  // chars per line

  function padLine(left, right, width = W58) {
    const spaces = width - left.length - right.length;
    return left + ' '.repeat(Math.max(1, spaces)) + right;
  }

  function hr(char = '-', width = W58) { return char.repeat(width); }

  const subtotal = order.items.reduce((s, i) => s + i.price * i.qty, 0);
  const delivery = order.delivery || (subtotal > 400 ? 0 : 40);
  const taxes    = Math.round(subtotal * 0.05);
  const total    = subtotal + delivery + taxes;

  let cmd = INIT;
  cmd += ALIGN_C + LARGE + BOLD_ON + 'ZestyBite' + NORMAL + BOLD_OFF + LINE_FEED;
  cmd += ALIGN_C + PRINTER_CONFIG.address + LINE_FEED;
  cmd += ALIGN_C + PRINTER_CONFIG.phone + LINE_FEED;
  cmd += ALIGN_L + hr() + LINE_FEED;

  cmd += BOLD_ON + padLine('Order:', '#' + order.id) + BOLD_OFF + LINE_FEED;
  cmd += padLine('Date:', new Date().toLocaleDateString('en-IN')) + LINE_FEED;
  cmd += hr() + LINE_FEED;

  order.items.forEach(item => {
    const name = item.name.substring(0, 22);
    cmd += padLine(name, `${item.qty}x₹${item.price}`) + LINE_FEED;
    cmd += ALIGN_R + '= ₹' + (item.price * item.qty) + LINE_FEED + ALIGN_L;
  });

  cmd += hr() + LINE_FEED;
  cmd += padLine('Subtotal:', '₹' + subtotal) + LINE_FEED;
  cmd += padLine('Delivery:', delivery === 0 ? 'FREE' : '₹' + delivery) + LINE_FEED;
  cmd += padLine('GST (5%):', '₹' + taxes) + LINE_FEED;
  cmd += hr('=') + LINE_FEED;
  cmd += BOLD_ON + LARGE + padLine('TOTAL', '₹' + total, W58 - 4) + NORMAL + BOLD_OFF + LINE_FEED;
  cmd += hr() + LINE_FEED;
  cmd += ALIGN_C + PRINTER_CONFIG.footer1 + LINE_FEED;
  cmd += ALIGN_C + PRINTER_CONFIG.footer2 + LINE_FEED;
  cmd += '\n\n\n';
  cmd += CUT;

  return cmd;
}

/** Send ESC/POS commands to server via fetch */
async function sendESCPOSToServer(commands) {
  try {
    const encoded = btoa(unescape(encodeURIComponent(commands)));
    const res = await fetch('/api/print', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: encoded })
    });
    if (res.ok) {
      showToast('🖨️ Receipt sent to printer', 'success');
    } else {
      throw new Error('Print server error');
    }
  } catch (err) {
    console.error('[Print] ESC/POS server error:', err);
    showToast('Printer unavailable — falling back to browser print', 'warning');
    // Fallback to browser print
    const order = JSON.parse(sessionStorage.getItem('last_order') || 'null');
    if (order) printViaBrowser(order);
  }
}

/* ============================================================
   5. UTILITY
   ============================================================ */
function generateBarcode(orderId) {
  // Simple checksum-based visual barcode number
  return orderId.replace(/\D/g, '').padStart(10, '0');
}

/** Format order for print preview (used in admin panel) */
function getReceiptPreview(orderId) {
  const orders = JSON.parse(localStorage.getItem('zb_orders') || '[]');
  const order  = orders.find(o => o.id === orderId);
  if (!order) { showToast('Order not found', 'error'); return; }
  printViaBrowser(order);
}

/* ============================================================
   6. INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Admin print buttons (in admin.html)
  document.querySelectorAll('[data-print-order]').forEach(btn => {
    btn.addEventListener('click', () => {
      const orderId = btn.dataset.printOrder;
      getReceiptPreview(orderId);
    });
  });
});

// Expose globally
window.printReceipt      = printReceipt;
window.getReceiptPreview = getReceiptPreview;
window.buildReceiptHTML  = buildReceiptHTML;