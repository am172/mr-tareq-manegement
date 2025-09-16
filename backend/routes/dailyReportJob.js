const cron = require("node-cron");
const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const axios = require("axios");
const path = require("path");

// 🔹 إعداد الإيميل
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "hmnm5485@gmail.com",
        pass: "evpo glmz ofwt imxi",
    },
});

// 🔹 دالة رسم جدول مع التحقق من امتلاء الصفحة
function drawTable(doc, headers, rows, startY) {
    const cellPadding = 5;
    const colWidth = (doc.page.width - 100) / headers.length;
    let y = startY;

    // رأس الجدول
    doc.fontSize(12).font("Amiri-Bold");
    headers.forEach((header, i) => {
        const x = 50 + i * colWidth;
        doc.rect(x, y, colWidth, 25).stroke();
        doc.text(header, x, y + cellPadding, { width: colWidth, align: "center" });
    });
    y += 25;

    // الصفوف
    doc.fontSize(10).font("Amiri-Regular");
    rows.forEach((row) => {
        if (y > doc.page.height - 100) {
            doc.addPage();
            y = 50;
        }
        row.forEach((cell, i) => {
            const x = 50 + i * colWidth;
            doc.rect(x, y, colWidth, 20).stroke();
            doc.text(cell.toString(), x, y + 5, { width: colWidth, align: "center" });
        });
        y += 20;
    });

    return y + 20;
}

// 🔹 جدول الملخص
function drawSummaryTable(doc, summary) {
    const headers = ["إجمالي المبيعات", "إجمالي المشتريات", "إجمالي المصروفات", "صافي الربح"];
    const values = [summary.sales, summary.purchases, summary.expenses, summary.profit];
    return drawTable(doc, headers, [values], doc.y + 10);
}

// 🔹 توليد PDF في Buffer
async function generateDailyReportPDF(report) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50 });
        const chunks = [];

        // ✅ الخطوط
        const fontRegular = path.join(__dirname, "..", "fonts", "Amiri-Regular.ttf");
        const fontBold = path.join(__dirname, "..", "fonts", "Amiri-Bold.ttf");
        doc.registerFont("Amiri-Regular", fontRegular);
        doc.registerFont("Amiri-Bold", fontBold);

        // اجمع الchunks في Buffer
        doc.on("data", (chunk) => chunks.push(chunk));
        doc.on("end", () => resolve(Buffer.concat(chunks)));
        doc.on("error", (err) => reject(err));

        // العنوان
        doc.font("Amiri-Bold").fontSize(20).text("📊 التقرير المالي الشامل", { align: "center" });
        doc.moveDown();
        doc.font("Amiri-Regular").fontSize(14).text(`📅 التاريخ: ${new Date().toLocaleDateString("en-GB")}`, { align: "right" });
        doc.moveDown(2);

        // ✅ الملخص
        doc.font("Amiri-Bold").fontSize(16).text("الملخص", { align: "right" });
        drawSummaryTable(doc, report.summary);
        doc.moveDown(2);

        // ✅ جدول المبيعات
        doc.font("Amiri-Bold").fontSize(14).text("📦 المبيعات", { align: "right" });
        drawTable(
            doc,
            ["المنتج", "المشتري", "الكمية", "السعر", "الخصم", "التاريخ"],
            report.details.sales.map((s) => [
                s.productName,
                s.buyer,
                s.quantity,
                s.price,
                `${s.discount || 0}%`,
                new Date(s.date).toLocaleDateString("en-GB"),
            ]),
            doc.y + 10
        );
        doc.moveDown(2);

        // ✅ جدول المشتريات
        doc.font("Amiri-Bold").fontSize(14).text("🛒 المشتريات", { align: "right" });
        drawTable(
            doc,
            ["المنتج", "المورد", "الكمية", "السعر", "الإجمالي", "التاريخ"],
            report.details.purchases.map((p) => {
                let quantity = 0;
                if (p.price > 0) {
                    const calc = p.total / p.price;
                    quantity = Number.isInteger(calc) ? calc : calc.toFixed(2);
                }
                return [
                    p.productName,
                    p.supplier,
                    quantity,
                    p.price,
                    p.total,
                    new Date(p.purchaseDate).toLocaleDateString("en-GB"),
                ];
            }),
            doc.y + 10
        );
        doc.moveDown(2);

        // ✅ جدول المصروفات
        doc.font("Amiri-Bold").fontSize(14).text("💰 المصروفات", { align: "right" });
        drawTable(
            doc,
            ["العنوان", "التصنيف", "المبلغ", "ملاحظات", "التاريخ"],
            report.details.expenses.map((e) => [
                e.title,
                e.category,
                e.amount,
                e.note || "-",
                new Date(e.date).toLocaleDateString("en-GB"),
            ]),
            doc.y + 10
        );
        doc.moveDown(2);

        // ✅ جدول المخزن
        if (report.details.inventory && report.details.inventory.length > 0) {
            doc.font("Amiri-Bold").fontSize(14).text("🏬 المخزن", { align: "right" });
            drawTable(
                doc,
                ["الرقم التسلسلي", "المنتج", "النوع", "المورد", "الكمية"],
                report.details.inventory.map((i) => [
                    i.serialNumber || "-",
                    i.productName,
                    i.type === "car" ? "سيارة" : "قطعة غيار",
                    i.supplier,
                    i.quantity,
                ]),
                doc.y + 10
            );
            doc.moveDown(2);
        }

        doc.end();
    });
}

// 🔹 إرسال الإيميل
async function sendReportEmail(buffer) {
    const today = new Date().toISOString().split("T")[0];
    const mailOptions = {
        from: "hmnm5485@gmail.com",
        to: "wazirglobalx@gmail.com",
        subject: "📊 التقرير المالي الشامل",
        text: "مرفق التقرير المالي الشامل بصيغة PDF.",
        attachments: [{ filename: `شامل-${today}.pdf`, content: buffer }],
    };
    await transporter.sendMail(mailOptions);
    console.log("✅ تم إرسال التقرير عبر الإيميل بدون حفظه في السيرفر");
}

// 🔹 تشغيل وإنشاء التقرير
async function generateAndSendDailyReport() {
    try {
        const today = new Date().toISOString().split("T")[0];
        const res = await axios.get("https://mr-tareq-manegement-backend.onrender.com/api/reports", {
            params: { type: "daily", date: today },
        });
        const report = res.data;
        const pdfBuffer = await generateDailyReportPDF(report);
        await sendReportEmail(pdfBuffer);
    } catch (err) {
        console.error("❌ خطأ في إرسال التقرير:", err.message);
    }
}


// بعد - يشتغل يومياً الساعة 23:59
cron.schedule("59 23 * * *", () => {
    console.log("⏰ جاري إنشاء وإرسال التقرير اليومي...");
    generateAndSendDailyReport();
});

