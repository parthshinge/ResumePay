import express from 'express';
import { OpenAI } from 'openai';
import pdf from 'pdf-parse';
import fs from 'fs/promises';
import { createWriteStream } from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();
const uploadDir = process.env.UPLOAD_DIR || (process.env.VERCEL ? '/tmp/uploads' : './uploads');

// Generate AI resume review
router.post('/generate', async (req, res) => {
  try {
    const { resumeId, filePath } = req.body;

    if (!resumeId || !filePath) {
      return res.status(400).json({ error: 'Missing resumeId or filePath' });
    }

    // Read and parse PDF
    const fileBuffer = await fs.readFile(filePath);
    const pdfData = await pdf(fileBuffer);
    const resumeText = pdfData.text;

    // Generate AI analysis
    const analysis = await generateResumeAnalysis(resumeText);

    // Generate PDF report
    const reportPath = await generatePDFReport(analysis, resumeId);

    res.json({
      success: true,
      review: {
        id: uuidv4(),
        resumeId,
        ...analysis,
        reportUrl: `/api/review/report/${resumeId}`,
        createdAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Review generation error:', error);
    res.status(500).json({ error: 'Failed to generate review' });
  }
});

// Download report
router.get('/report/:resumeId', async (req, res) => {
  try {
    const { resumeId } = req.params;
    const reportPath = path.join(uploadDir, `report_${resumeId}.pdf`);
    
    const fileExists = await fs.access(reportPath).then(() => true).catch(() => false);
    
    if (!fileExists) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.download(reportPath, `resume_review_${resumeId}.pdf`);
  } catch (error) {
    console.error('Report download error:', error);
    res.status(500).json({ error: 'Failed to download report' });
  }
});

async function generateResumeAnalysis(resumeText: string) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const prompt = `
    Analyze this resume and provide a detailed review in JSON format:
    
    Resume Text:
    ${resumeText}
    
    Return a JSON object with the following structure:
    {
      "atsScore": number (0-100),
      "keywordScore": number (0-100),
      "grammarScore": number (0-100),
      "formattingScore": number (0-100),
      "roleFitScore": number (0-100),
      "overallScore": number (0-100),
      "strengths": string[],
      "weaknesses": string[],
      "suggestions": string[],
      "atsOptimization": string,
      "recruiterPerspective": string
    }
  `;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: 'You are an expert resume reviewer and career coach. Analyze resumes and provide detailed, actionable feedback.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  });

  const analysis = JSON.parse(completion.choices[0].message.content || '{}');
  return analysis;
}

async function generatePDFReport(analysis: any, resumeId: string): Promise<string> {
  const reportPath = path.join(uploadDir, `report_${resumeId}.pdf`);
  const doc = new PDFDocument();
  const stream = createWriteStream(reportPath);
  doc.pipe(stream);

  // Title
  doc.fontSize(24).font('Helvetica-Bold').text('Resume Review Report', { align: 'center' });
  doc.moveDown();

  // Overall Score
  doc.fontSize(18).font('Helvetica-Bold').text(`Overall Score: ${analysis.overallScore}/100`);
  doc.moveDown();

  // Score Breakdown
  doc.fontSize(14).font('Helvetica-Bold').text('Score Breakdown:');
  doc.fontSize(12).font('Helvetica');
  doc.text(`ATS Score: ${analysis.atsScore}/100`);
  doc.text(`Keyword Score: ${analysis.keywordScore}/100`);
  doc.text(`Grammar Score: ${analysis.grammarScore}/100`);
  doc.text(`Formatting Score: ${analysis.formattingScore}/100`);
  doc.text(`Role Fit Score: ${analysis.roleFitScore}/100`);
  doc.moveDown();

  // Strengths
  doc.fontSize(14).font('Helvetica-Bold').text('Strengths:');
  doc.fontSize(12).font('Helvetica');
  analysis.strengths.forEach((strength: string) => {
    doc.text(`• ${strength}`);
  });
  doc.moveDown();

  // Weaknesses
  doc.fontSize(14).font('Helvetica-Bold').text('Areas for Improvement:');
  doc.fontSize(12).font('Helvetica');
  analysis.weaknesses.forEach((weakness: string) => {
    doc.text(`• ${weakness}`);
  });
  doc.moveDown();

  // Suggestions
  doc.fontSize(14).font('Helvetica-Bold').text('Suggestions:');
  doc.fontSize(12).font('Helvetica');
  analysis.suggestions.forEach((suggestion: string) => {
    doc.text(`• ${suggestion}`);
  });
  doc.moveDown();

  // ATS Optimization
  doc.fontSize(14).font('Helvetica-Bold').text('ATS Optimization:');
  doc.fontSize(12).font('Helvetica').text(analysis.atsOptimization);
  doc.moveDown();

  // Recruiter Perspective
  doc.fontSize(14).font('Helvetica-Bold').text('Recruiter Perspective:');
  doc.fontSize(12).font('Helvetica').text(analysis.recruiterPerspective);

  doc.end();

  return new Promise((resolve, reject) => {
    stream.on('finish', () => resolve(reportPath));
    stream.on('error', reject);
  });
}

export default router;
