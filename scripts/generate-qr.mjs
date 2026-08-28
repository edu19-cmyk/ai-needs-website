import QRCode from "qrcode";

const url = "https://ai-needs-website-one.vercel.app";

await QRCode.toFile("public/images/ai-needs-website-qr.png", url, {
  errorCorrectionLevel: "H",
  margin: 4,
  width: 1024,
  color: { dark: "#171717", light: "#fafafa" },
});
