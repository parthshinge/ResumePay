import express, { Request, Response } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import { getBackendConfig } from '../config';

const router = express.Router();
const config = getBackendConfig();

// Configure multer for file uploads
const uploadDir = config.uploadDir;
const maxFileSize = config.maxFileSize;

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, uploadDir);
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: maxFileSize,
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  },
});

// Upload resume endpoint
router.post('/', upload.single('resume'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const resumeId = uuidv4();
    const filePath = req.file.path;
    const fileSize = req.file.size;
    const originalName = req.file.originalname;

    // Return 402 Payment Required with payment details
    const paymentAmount = config.paymentAmountUsdc;
    const recipientAddress = config.recipientAddress;

    res.status(402).json({
      error: 'Payment Required',
      message: 'Please complete payment to process your resume review',
      payment: {
        amount: paymentAmount,
        token: 'USDC',
        chain: 'base',
        chainId: 8453,
        recipientAddress: recipientAddress,
        resumeId: resumeId,
      },
      resume: {
        id: resumeId,
        filePath: filePath,
        originalName: originalName,
        fileSize: fileSize,
        mimeType: req.file.mimetype,
        uploadedAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload resume' });
  }
});

export default router;
