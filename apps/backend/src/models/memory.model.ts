// apps/backend/src/models/memory.model.ts

import { Schema, model } from 'mongoose'

const memorySchema = new Schema({
    author: {
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    date: { type: Date, required: true },
    // day: {
    //     type: Number,
    //     required: true
    // },
    // month: {
    //     type: Number,
    //     required: true
    // },
    // year: {
    //     type: Number,
    //     required: true
    // },
    title: {
        type: String,
        required: false
    },
    content: {
        type: String,
        required: true
    },
    shared: {
        type: Boolean,
        default: false
    },
    image: {
        type: Schema.Types.ObjectId,
        ref: 'Image',
        required: false
    },
    // images: [{
    //     type: Schema.Types.ObjectId,
    //     ref: 'UserImage',
    //     required: false
    //     // default: []
    // }],
    // comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
},
{
    timestamps: true
})

memorySchema.pre('save', function(next) {
    this.title = this.title || 'Untitled'
    next()
})

export default model('Memory', memorySchema)
