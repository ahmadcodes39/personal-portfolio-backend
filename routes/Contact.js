import { body, validationResult } from "express-validator";
import express from "express";
import User from "../Models/userSchema.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const validations = [
  body("email").isEmail().withMessage("Invalid Email address"),
  body("name")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),
  body("phone").isMobilePhone("any").withMessage("Invalid phone number"),
];

router.post("/contact", validations, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, phone, email, message } = req.body;
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "This Email has already responded" });
    }

    const newUser = new User({ name, phone, email, message });
    const savedUser = await newUser.save();
    if (savedUser) {
      res
        .status(200)
        .json({ message: "User created successfully", user: savedUser });

      // Email send by user to me
      user_Email_To_Mine(name, phone, email, message);
     // Welcome email to user
      mineEmail_To_user(name, phone, email, message);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

const user_Email_To_Mine = (name, phone, email, message) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MY_EMAIL,
      pass: process.env.APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: email,
    to: process.env.MY_EMAIL,
    subject: "PortFolio User",
    html: `
            <h2>PortFolio User Details</h2>
            <p><strong>Name:<strong/>${name}</p>
            <p><strong>Phone:<strong/>${phone}</p>
            <p><strong>Email:<strong/>${email}</p>
            <p><strong>Message:<strong/>${message}</p>
            `,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

const mineEmail_To_user = (name, phone, email, message) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MY_EMAIL,
      pass: process.env.APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.MY_EMAIL,
    to: email,
    subject: "Ready to Get Started? Let's Talk About Your Project",
    html: `
        <div className ='container emailStyling'>
            <h1>Hello ${name},</h1>
            <p>Thank you for reaching out through my portfolio's subscribe section. I appreciate your interest in working with me!</p>
            <p>I'm excited about the possibility of collaborating with you on your project. Whether you need help with [specific type of work] or have a new idea you'd like to discuss,I’m ready to help with your project and provide the support you need.</p>
            <p>Please feel free to reply to this email or contact me directly at my number ${process.env.PHONE_NO} if you have any questions or would like to get started. I look forward to hearing from you!</p>
            <p>Best regards,</p>
            <p>${process.env.NAME}</p>
            <a>${process.env.MY_EMAIL}</a>
        </div>    
    
    `,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

export default router;
