import mongoose from "mongoose";

const PageSchema = new mongoose.Schema({
    index: {
        type: Number,
        required: true,
        min: 1,
    },
    image_url: {
        type: String,
        required: true,
    },
});

const ChapterSchema = new mongoose.Schema(
    {
        manga_id: {
            type: String,
            required: true,
            index: true,
        },
        number: {
            type: Number,
            required: true,
        },
        title: {
            type: String,
        },
        pages: {
            type: [PageSchema],
            required: true,
        },
        created_at: {
            type: Date,
            default: () => new Date(),
        },
        updated_at: {
            type: Date,
            default: () => new Date(),
        },
    },
    { collection: "chapters" }
);

ChapterSchema.index({ manga_id: 1, chap_number: 1 }, { unique: true });

ChapterSchema.pre("save", function (next) {
    this.updated_at = new Date();
    next();
});

export const Chapter = mongoose.model("Chapter", ChapterSchema);
