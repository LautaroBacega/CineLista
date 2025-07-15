import mongoose from "mongoose"

const listSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    movies: [
      {
        movieId: {
          type: Number,
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        posterPath: String,
        releaseDate: String,
        voteAverage: Number,
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    shareToken: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  { timestamps: true },
)

// Index for better performance
listSchema.index({ user: 1 })
listSchema.index({ shareToken: 1 })
listSchema.index({ isPublic: 1 })

const List = mongoose.model("List", listSchema)

export default List
