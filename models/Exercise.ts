import mongoose from 'mongoose'

const ExerciseSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  chapterId: {
    type: String,
    required: true
  },
  lessonId: {
    type: String,
    required: true
  },
  lessonTitle: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['multiple-choice', 'calculation'],
    required: true
  },
  question: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    required: false
  },
  correctAnswer: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  explanation: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['basic', 'intermediate', 'advanced'],
    required: true
  },
  category: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

// Index để tìm kiếm nhanh theo lessonId
ExerciseSchema.index({ chapterId: 1 })
ExerciseSchema.index({ lessonId: 1 })
ExerciseSchema.index({ difficulty: 1 })

export default mongoose.models.Exercise || mongoose.model('Exercise', ExerciseSchema)
