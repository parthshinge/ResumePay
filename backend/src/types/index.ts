export interface PaymentRequest {
  walletAddress: string;
  amount: string;
  token: string;
}

export interface PaymentVerification {
  txHash: string;
  walletAddress: string;
  amount: string;
  status: 'pending' | 'confirmed' | 'failed';
}

export interface ResumeUpload {
  id: string;
  originalName: string;
  size: number;
  mimeType: string;
  filePath: string;
  uploadedAt: Date;
}

export interface ResumeReview {
  id: string;
  resumeId: string;
  walletAddress: string;
  atsScore: number;
  keywordScore: number;
  grammarScore: number;
  formattingScore: number;
  roleFitScore: number;
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  reportUrl: string;
  createdAt: Date;
}

export interface PaymentRecord {
  id: string;
  walletAddress: string;
  txHash: string;
  amount: string;
  token: string;
  status: 'pending' | 'confirmed' | 'failed';
  chainId: number;
  createdAt: Date;
}
