const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const Admin = require("../models/adminModel");
const User = require("../models/userModel");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/imovies";

async function seedAdmin() {
  console.log("=========================================");
  console.log("🎬 iMovies - Initial User & Admin Seeder");
  console.log("=========================================");
  console.log(`Connecting to: ${MONGO_URI}`);

  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("✅ Successfully connected to MongoDB!");

    const salt = await bcrypt.genSalt(10);

    // 1. Seed or Reset Administrator
    const adminEmail = process.env.ADMIN_EMAIL || "admin@imovies.com";
    const adminPasswordPlain = process.env.ADMIN_PASSWORD || "admin123";
    const adminHashed = await bcrypt.hash(adminPasswordPlain, salt);

    let admin = await Admin.findOne({ email: adminEmail });
    if (!admin) {
      admin = await Admin.create({
        username: "admin",
        email: adminEmail,
        password: adminHashed,
        role: "admin",
      });
      console.log(`✅ Admin created: ${admin.email}`);
    } else {
      admin.password = adminHashed;
      await admin.save();
      console.log(`✅ Admin password reset: ${admin.email}`);
    }

    // 2. Seed or Reset Demo Customer User
    const userEmail = "demo@imovies.com";
    const userPasswordPlain = "user123";
    const userHashed = await bcrypt.hash(userPasswordPlain, salt);

    let user = await User.findOne({ email: userEmail });
    if (!user) {
      user = await User.create({
        username: "moviefan",
        email: userEmail,
        password: userHashed,
        role: "user",
        isVerified: true,
      });
      console.log(`✅ Demo User created: ${user.email}`);
    } else {
      user.password = userHashed;
      user.isVerified = true;
      await user.save();
      console.log(`✅ Demo User password reset: ${user.email}`);
    }

    console.log("=========================================");
    console.log("🎉 Credentials Ready for Login:");
    console.log("-----------------------------------------");
    console.log("👑 ADMIN ACCOUNT:");
    console.log(`   Email:    ${adminEmail}`);
    console.log(`   Password: ${adminPasswordPlain}`);
    console.log(`   Portal:   http://localhost:5173/login (Tab: 'Sign In as Admin')`);
    console.log("-----------------------------------------");
    console.log("👤 DEMO USER ACCOUNT:");
    console.log(`   Email:    ${userEmail}`);
    console.log(`   Password: ${userPasswordPlain}`);
    console.log(`   Portal:   http://localhost:5173/login (Tab: 'Movie Fan')`);
    console.log("=========================================");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    if (error.message.includes("bad auth")) {
      console.error("👉 Check your database username and password in server/.env.");
    } else if (error.message.includes("ECONNREFUSED") || error.message.includes("buffering timed out")) {
      console.error("👉 Make sure your MongoDB service is running (locally or on Atlas).");
    }
    process.exit(1);
  }
}

seedAdmin();
