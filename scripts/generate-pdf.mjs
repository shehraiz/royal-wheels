import puppeteer from "puppeteer-core";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = "http://localhost:3001";

const PAGES = [
  { title: "Home", url: "/" },
  { title: "Our Fleet", url: "/fleet" },
  { title: "Fleet — Sedans", url: "/fleet?category=Sedan" },
  { title: "Fleet — SUVs", url: "/fleet?category=SUV" },
  { title: "Fleet — Pickup / 4x4", url: "/fleet?category=Pickup%2F4x4" },
  { title: "Vehicle Detail — Toyota Fortuner", url: "/vehicle/toyota-fortuner" },
  { title: "Vehicle Detail — Toyota Land Cruiser V8", url: "/vehicle/toyota-land-cruiser-v8" },
  { title: "Booking Form — Toyota Fortuner", url: "/book/toyota-fortuner" },
  { title: "Escort & Protocol", url: "/escort" },
  { title: "Customer Login", url: "/account/login" },
  { title: "Admin Login", url: "/admin/login" },
];

async function run() {
  console.log("Launching browser…");
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  // Desktop viewport
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });

  const buffers = [];

  for (const p of PAGES) {
    console.log(`  📸  ${p.title}`);
    await page.goto(`${BASE}${p.url}`, { waitUntil: "networkidle0", timeout: 20000 });
    await new Promise((r) => setTimeout(r, 800)); // let fonts/images settle

    // Capture full page as PDF page
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
      displayHeaderFooter: true,
      headerTemplate: `
        <div style="width:100%;font-family:sans-serif;font-size:9px;padding:6px 20px;display:flex;justify-content:space-between;color:#888;border-bottom:1px solid #eee;">
          <span style="font-weight:600;color:#C9A227">Royal Wheels</span>
          <span>${p.title}</span>
          <span>${BASE}${p.url}</span>
        </div>`,
      footerTemplate: `
        <div style="width:100%;font-family:sans-serif;font-size:8px;padding:4px 20px;display:flex;justify-content:space-between;color:#bbb;">
          <span>Every Ride, A Royal Experience</span>
          <span class="pageNumber"></span>/<span class="totalPages"></span>
        </div>`,
    });

    buffers.push(pdf);
  }

  await browser.close();

  // Merge PDFs using raw byte concatenation via pdf-lib if available,
  // otherwise write individual files and note them.
  // Try pdf-lib merge:
  try {
    const { PDFDocument } = await import("pdf-lib");
    const merged = await PDFDocument.create();

    for (const buf of buffers) {
      const doc = await PDFDocument.load(buf);
      const pages = await merged.copyPages(doc, doc.getPageIndices());
      pages.forEach((pg) => merged.addPage(pg));
    }

    const outBytes = await merged.save();
    const outPath = join(__dirname, "../Royal_Wheels_Website_Navigation.pdf");
    writeFileSync(outPath, outBytes);
    console.log(`\n✅  PDF saved → ${outPath}`);
  } catch {
    // pdf-lib not available — save first page only and note
    const outPath = join(__dirname, "../Royal_Wheels_Homepage.pdf");
    writeFileSync(outPath, buffers[0]);
    console.log(`\n⚠️  pdf-lib not installed. Saved homepage only → ${outPath}`);
    console.log("Run: npm install pdf-lib  then retry.");
  }
}

run().catch((e) => { console.error(e); process.exit(1); });
