import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { create, deletebook, getbooks, updatebook } from '../controllers/book.controller.js';

const router = express.Router();

router.post('/create', verifyToken, create)
router.get('/getbooks', getbooks)
router.delete('/deletebook/:bookId/:userId', verifyToken, deletebook)
router.put('/updatebook/:bookId/:userId', verifyToken, updatebook)


export default router;