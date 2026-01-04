import mongoose, { Document, Schema } from "mongoose"

export interface IPost extends Document {
  title: string
  content: string
  userId: mongoose.Types.ObjectId
}

const postSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
)

export const Post = mongoose.model<IPost>("Post", postSchema)
