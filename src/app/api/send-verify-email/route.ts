import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  const { email, code } = await req.json();

  if (!email || !code) {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;

  if (!gmailUser || !gmailPass) {
    // Dev fallback: return code in response (only usable server-side log)
    console.log(`[DEV] 이메일 인증 코드 (${email}): ${code}`);
    return NextResponse.json({ error: "이메일 서비스가 설정되지 않았습니다. GMAIL_USER와 GMAIL_APP_PASSWORD를 .env.local에 설정해주세요." }, { status: 503 });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: gmailUser, pass: gmailPass },
    });

    await transporter.sendMail({
      from: `"DCoderHub" <${gmailUser}>`,
      to: email,
      subject: "DCoderHub 이메일 인증 코드",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#f8fafc;border-radius:12px;">
          <h2 style="font-size:20px;font-weight:700;color:#1e293b;margin-bottom:8px;">DCoderHub 이메일 인증</h2>
          <p style="color:#64748b;font-size:14px;margin-bottom:24px;">아래 인증 코드를 입력해주세요. 코드는 10분간 유효합니다.</p>
          <div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:20px;text-align:center;margin-bottom:24px;">
            <span style="font-size:36px;font-weight:700;letter-spacing:8px;color:#6366f1;">${code}</span>
          </div>
          <p style="color:#94a3b8;font-size:12px;">본인이 요청하지 않았다면 이 메일을 무시하세요.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("이메일 발송 실패:", err);
    return NextResponse.json({ error: "이메일 발송에 실패했습니다." }, { status: 500 });
  }
}
