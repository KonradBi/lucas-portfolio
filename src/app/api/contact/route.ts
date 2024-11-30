import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { message, contact } = await req.json();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'lukas.vandeverre@googlemail.com',
        pass: process.env.GMAIL_APP_PASSWORD // We'll set this up in .env
      }
    });

    const mailOptions = {
      from: 'lukas.vandeverre@googlemail.com',
      to: 'lukas.vandeverre@googlemail.com',
      subject: 'New Portfolio Contact',
      text: `Message: ${message}\n\nContact: ${contact}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}</p>
        <p><strong>Contact:</strong><br>${contact}</p>
      `
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
} 