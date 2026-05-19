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
        source: {
            type: String,
            enum: ['stored', 'blueprint'],
            required: true,
            default: 'stored',
        },
        timeAlloted: {
            type: Number,
            required: true,
            default: 30,
        },
        isDefault: {
            type: Boolean,
            default: false,
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
