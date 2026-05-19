import mongoose from 'mongoose'

const ExerciseBlueprintSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    lessonId: {
        type: String,
        required: true
    },
    chapterId: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['multiple-choice', 'calculation'],
        required: true
    },
    questionTemplate: {
        type: String,
        required: true
    },
    correctAnswerTemplate: {
        type: String,
        required: true
    },
    explanationTemplate: {
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
    },
    variables: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true
})

// Index để tìm kiếm nhanh theo lessonId
ExerciseBlueprintSchema.index({ lessonId: 1 })
ExerciseBlueprintSchema.index({ difficulty: 1 })

export default mongoose.models.ExerciseBlueprint || mongoose.model('ExerciseBlueprint', ExerciseBlueprintSchema)
