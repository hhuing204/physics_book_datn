import mongoose, { Types } from 'mongoose'

export interface IPracticeProgress {
    _id?: string
    practiceTestId: Types.ObjectId
    user_id: Types.ObjectId
    accessCode: string
    timeAlloted: number
    startAt: Date
    submittedAt?: Date | null
    status: 'in-progress' | 'finished'
    answers: Array<{
        exerciseId: string
        answer: mongoose.Schema.Types.Mixed
        correct: boolean
        graded?: boolean
        question: string
    }>
    score: number
    createdAt?: Date
    updatedAt?: Date
}

const PracticeProgressSchema = new mongoose.Schema<IPracticeProgress>(
    {
        practiceTestId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PracticeTest',
            required: true,
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        accessCode: {
            type: String,
            required: true,
        },
        timeAlloted: {
            type: Number,
            required: true,
        },
        startAt: {
            type: Date,
            required: true,
            default: Date.now,
        },
        submittedAt: {
            type: Date,
            default: null,
        },
        status: {
            type: String,
            enum: ['in-progress', 'finished'],
            default: 'in-progress',
        },
        answers: {
            type: [
                {
                    exerciseId: String,
                    answer: mongoose.Schema.Types.Mixed,
                    correct: Boolean,
                    graded: {
                        type: Boolean,
                        default: true,
                    },
                    question: String,
                }
            ],
            default: [],
        },
        score: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
)

PracticeProgressSchema.index({ user_id: 1, practiceTestId: 1 })
PracticeProgressSchema.index({ accessCode: 1 })

export default mongoose.models.PracticeProgress || mongoose.model<IPracticeProgress>('PracticeProgress', PracticeProgressSchema)
