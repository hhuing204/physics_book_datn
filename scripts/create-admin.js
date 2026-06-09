require("dotenv").config({ path: ".env.local" });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI;

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  name: { type: String, required: true, trim: true },
  avatar: { type: String, default: null },
  role: { type: String, enum: ['learner', 'teacher', 'admin'], default: 'learner' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function createAdmin() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected');

    const adminData = {
      email: 'admin@physicsbook.com',
      password: 'admin123456',
      name: 'Administrator',
      role: 'admin',
      isActive: true
    };

    const existing = await User.findOne({ email: adminData.email });
    if (existing) {
      console.log('❌ Admin already exists!');
      await mongoose.disconnect();
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminData.password, salt);

    const admin = new User({ ...adminData, password: hashedPassword });
    await admin.save();

    console.log('\n✓ Admin account created!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Email:', adminData.email);
    console.log('Password:', adminData.password);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

createAdmin();
