import mongoose, { Types } from 'mongoose';

export interface ITheoryProgress {
  _id?: string;
  user_id: Types.ObjectId;
  lesson_id: Types.ObjectId;
  lessonId: string;
  completedAt?: Date;
  timeSpent?: number; // in minutes
  createdAt?: Date;
  updatedAt?: Date;
}

const TheoryProgressSchema = new mongoose.Schema<ITheoryProgress>(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'User ID is required'],
      ref: 'User',
    },
    lesson_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Lesson ID is required'],
      ref: 'Lesson'
    },
    lessonId: {
      type: String,
      required: [true, 'Lesson ID string is required'],
    },
    completedAt: {
      type: Date,
      default: null,
    },
    timeSpent: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// index for efficient queries and to ensure a user can only have one progress record per lesson
TheoryProgressSchema.index({ user_id: 1, lessonId: 1 }, { unique: true });
TheoryProgressSchema.index({ lessonId: 1 });

// Avoid re-compilation in development
const TheoryProgress =
  mongoose.models.TheoryProgress ||
  mongoose.model<ITheoryProgress>('TheoryProgress', TheoryProgressSchema);

export default TheoryProgress;