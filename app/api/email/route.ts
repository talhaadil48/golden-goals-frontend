import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { to, subject, text, html } = await request.json();

    if (!to || (!text && !html)) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    });

    return NextResponse.json({ success: true, info }, { status: 200 });
  } catch (error: any) {
    console.error('Email API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
