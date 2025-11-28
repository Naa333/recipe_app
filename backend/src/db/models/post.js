import mongoose, { Schema } from 'mongoose'

const postSchema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    image: { type: String, required: true },
    contents: { type: String, required: true },
    tags: [String],
    likes: { type: Number, default: 0 },
  },
  { timestamps: true },
)

export const Post = mongoose.model('post', postSchema)
