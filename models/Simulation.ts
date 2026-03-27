import mongoose from 'mongoose';

const SimulationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    chapterId: {
        type: String,
        ref: 'Chapter',
        required: true,
    },
    componentName: {
        type: String,
        required: true,
    },
    icon: String,
    color: {
        start: String,
        end: String,
    },
    defaultParams: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
    },
    order: {
        type: Number,
        default: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

export default mongoose.models.Simulation || mongoose.model('Simulation', SimulationSchema);