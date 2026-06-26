import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import crypto from "crypto";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email requis" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ success: true, message: "Si cet email existe, un lien de réinitialisation a été envoyé" });
    }

    const resetToken = crypto.randomUUID();
    const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    try {
      await resend.emails.send({
        from: "InnovYed <noreply@innovyed.solutions>",
        to: [email],
        subject: "Réinitialiser votre mot de passe InnovYed",
        html: `<div>
  <h2>Réinitialiser votre mot de passe</h2>
  <p>Cliquez sur le bouton ci-dessous pour réinitialiser votre mot de passe.</p>
  <a href="https://innovyed.solutions/reset-password?token=${resetToken}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 4px;">Réinitialiser le mot de passe</a>
  <p>Ce lien expire dans 15 minutes.</p>
</div>`,
      });
    } catch (emailError) {
      console.error("Erreur d'envoi d'email:", emailError);
    }

    return NextResponse.json({ success: true, message: "Si cet email existe, un lien de réinitialisation a été envoyé" });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
