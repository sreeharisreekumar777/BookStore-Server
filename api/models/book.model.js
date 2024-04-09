import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
            unique: true,
        },
        image: {
            type: String,
            default:
                "https://img.freepik.com/free-photo/book-composition-with-open-book_23-2147690555.jpg",
        },
        pdf: {
            type: String,
            default:
                "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        },
        category: {
            type: String,
            default: "uncategorized",
        },
        genre: {
            type: String,
            default: "",
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
        keywords: {
            type: [String],
        },
    },
    { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);

export default Book;
