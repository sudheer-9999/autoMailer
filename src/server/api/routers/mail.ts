import { TRPCError } from "@trpc/server";
import fs from "fs";
import nodemailer, { TransportOptions } from "nodemailer";
import path from "path";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const mailRouter = createTRPCRouter({
  autoApply: publicProcedure.mutation(
    async ({ input, ctx: { db, req, res, userId } }) => {
      const user = await db.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          applications: true,
        },
      });

      const notFoundError = new TRPCError({
        code: "NOT_FOUND",
        message: "User Not Found",
      });

      if (!user) return notFoundError;

      

      const jobPostings = await db.jobPosting.findMany();
      

      let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: user.email,
          pass: user.gmailPassword,
        },
      } as TransportOptions);

      const publicFilePath = path.join(
        process.cwd(),
        "public",
        "Bandaru_Sudheer.pdf",
      );

      const pdfAttachment = fs.readFileSync(publicFilePath);

      const attachments = [
        {
          filename: "Bandaru_Sudheer.pdf",
          content: pdfAttachment,
          encoding: "base64",
        },
      ];

      let sentCount = 0; // Initialize counter for successfully sent emails

      try {
        for (const job of jobPostings) {
          // Check if the user has already applied for this job
          const existingApplication = user.applications.find(
            (app) => app.jobPostingId === job.id,
          );

          // if (existingApplication) {
          //   console.log(`User already applied for job: ${job.id}`);
          //   continue; // Skip sending email and saving application
          // }

          await transporter.sendMail({
            from: user.email,
            to: job.hrMail,
            subject: `Application for ${job.title} Developer`,
            text: `Dear Hr,

I hope this message finds you well. I am writing to express my interest in the ${job.title} developer position , as advertised linkedIn.

As a self-taught Full Stack Technology Enthusiast with a strong background in developing web and mobile applications using technologies like React, React Native, Next.js, Node.js, and Express.js, I bring a proven track record of delivering high-quality projects. My experience includes integrating Strapi for content management, optimizing performance with server-side rendering, and building RESTful APIs for seamless user experiences.

In my current role at MansWorld Web and App Solution, I have successfully implemented solutions that enhance both user experience and operational efficiency. For instance, I integrated Razorpay and Stripe for secure online transactions and developed a calendar generation system using Prisma and Next.js, demonstrating my ability to deliver scalable and efficient solutions.

Thank you for considering my application. I am eager to further discuss how my background and skills align with the needs of company. Please find my resume attached for your review.

Looking forward to the possibility of joining your team.

Best regards,
Bandaru Sudheer`,
            attachments: attachments,
          });

          // Increment the counter for successfully sent emails
          sentCount++;

          // Save application details for each job posting
          await db.application.create({
            data: {
              jobPostingId: job.id,
              userId: user.id,
            },
          });
        }

        return {
          success: true,
          message: `Emails sent successfully: ${sentCount}`,
        };
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to send email: ${error.message}`,
        });
      }
    },
  ),
});
