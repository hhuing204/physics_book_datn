import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
import mongoose from "mongoose";

// import lessons
import lesson1 from "../lessons/lesson1";
import lesson2 from "../lessons/lesson2";
import lesson3 from "../lessons/lesson3";
import lesson4 from "../lessons/lesson4";
import formulas from "../lessons/formulas";

import Chapter from "../models/Chapter";

const MONGODB_URI = process.env.MONGODB_URI;

const chapter = {
  id: "chapter-1",
  title: "Chương 1: Dao Động",
  subtitle: "Tổng hợp các bài học về dao động",
  icon: "🌊",
  content:
    "Chương này nghiên cứu về dao động cơ học, phương trình dao động điều hòa, năng lượng, dao động tắt dần và cộng hưởng.",

  lessons: [lesson1, lesson2, lesson3, lesson4],
  formulas: formulas,
  images: [],
  exercises: [],
  order: 1,
  isPublished: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

async function seedChapter(): Promise<void> {
  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(MONGODB_URI);
    console.log("✓ Connected");

    await Chapter.deleteMany({});
    console.log("✓ Deleted");

    const result = await Chapter.create(chapter);
    console.log("✓ Created:", result._id);

    await mongoose.disconnect();
    console.log("✓ Disconnected");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);

    await mongoose.disconnect();
    process.exit(1);
  }
}

// run only if executed directly
if (require.main === module) {
  seedChapter();
}