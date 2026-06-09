import mongoose from 'mongoose'

const PracticeTestSchema = new mongoose.Schema(
    {
        accessCode: {
            type: String,
            required: true,
            unique: true,
        },
        lessonId: {
            type: String,
            default: null,
        },
        chapterId: {
            type: String,
            default: null,
        },
        timeAlloted: {
            type: Number,
            required: true,
            default: 30,
        },
        exercises: {
            type: [mongoose.Schema.Types.Mixed],
            default: [],
        },
    },
    {
        timestamps: true,
    }
)

export default mongoose.models.PracticeTest || mongoose.model('PracticeTest', PracticeTestSchema)
