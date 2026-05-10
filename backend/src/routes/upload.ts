import express from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';

const router = express.Router();
const uploadDir = process.env.UPLOAD_DIR || (process.env.VERCEL ? '/tmp/uploads' : './uploads');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error as Error, uploadDir);
    }
  },
  filename: (req, file, cb) => {
    const uniqueId = uuidv4();
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueId}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB default
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf'];
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error('Only PDF files are allowed'));
      return;
    }
    cb(null, true);
  },
});

// Upload resume endpoint
router.post('/', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const resumeData = {
      id: uuidv4(),
      originalName: req.file.originalname,
      size: req.file.size,
      mimeType: req.file.mimetype,
      filePath: req.file.path,
      uploadedAt: new Date(),
    };

    // Return 402 Payment Required with payment details
    const paymentAmount = process.env.PAYMENT_AMOUNT_USDC || '5';
    
    res.status(402).json({
      error: 'Payment Required',
      message: 'Please complete payment to process your resume review',
      payment: {
        amount: paymentAmount,
        token: 'USDC',
        chain: 'base',
        chainId: 8453,
        recipientAddress: process.env.RECIPIENT_ADDRESS || '0x...',
        resumeId: resumeData.id,
      },
      resume: resumeData,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload resume' });
  }
});

export default router;
