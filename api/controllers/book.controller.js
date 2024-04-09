import Book from "../models/book.model.js";
import { errorHandler } from "../utils/error.js";

export const create = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to create a book"));
  }
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, "Please provide all required fields"));
  }
  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "");
  const newBook = new Book({
    ...req.body,
    slug,
    userId: req.user.id,
  });
  try {
    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (error) {
    next(error);
  }
};

export const getbooks = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 12;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;
    const books = await Book.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.genre && { genre: req.query.genre }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.bookId && { _id: req.query.bookId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: 'i' } },
          { content: { $regex: req.query.searchTerm, $options: 'i' } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalBooks = await Book.countDocuments();

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthBooks = await Book.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      books,
      totalBooks,
      lastMonthBooks,
    });
  } catch (error) {
    next(error);
  }
};
export const deletebook = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to delete this book"));
  }
  try {
    await Book.findByIdAndDelete(req.params.bookId);
    res.status(200).json("The book has been deleted");
  } catch (error) {
    next(error);
  }
};

export const updatebook = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update this book"));
  }
  try {
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.bookId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          image: req.body.image,
          keywords: req.body.keywords,
          genre: req.body.genre,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedBook);
  } catch (error) {
    next(error);
  }
};