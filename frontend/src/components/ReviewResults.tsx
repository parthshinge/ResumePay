'use client';

import { useState, useEffect } from 'react';
import { Download, RefreshCw, FileText, CheckCircle, TrendingUp, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import { apiUrl } from '../lib/api';

interface ReviewResultsProps {
  resumeData: any;
  paymentData: any;
  onComplete: (data: any) => void;
  onReset: () => void;
}

export default function ReviewResults({
  resumeData,
  paymentData,
  onComplete,
  onReset,
}: ReviewResultsProps) {
  const [reviewData, setReviewData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    // Simulate loading review data
    setTimeout(() => {
      setReviewData({
        atsScore: 85,
        keywordScore: 78,
        grammarScore: 92,
        formattingScore: 88,
        roleFitScore: 82,
        overallScore: 85,
        strengths: [
          'Strong action verbs used throughout',
          'Clear and concise summary',
          'Good quantification of achievements',
          'Professional formatting',
        ],
        weaknesses: [
          'Missing key industry keywords',
          'Could improve bullet point structure',
          'Limited soft skills demonstration',
        ],
        suggestions: [
          'Add more industry-specific keywords for ATS optimization',
          'Include metrics for all achievements where possible',
          'Consider adding a skills section',
          'Improve consistency in bullet point formatting',
        ],
        atsOptimization:
          'Your resume scores well on ATS but could be improved by adding more keywords from job descriptions. Focus on technical skills and industry terminology.',
        recruiterPerspective:
          'Your resume presents a strong professional profile. The quantification of achievements is excellent. Consider adding more context to your role descriptions to better showcase your impact.',
      });
      setLoading(false);
    }, 2000);
  }, []);

  const downloadReport = async () => {
    setDownloading(true);
    try {
      const response = await axios.get(
        apiUrl(`/api/review/report/${resumeData.id}`),
        {
          responseType: 'blob',
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `resume_review_${resumeData.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
          <p className="text-gray-600">Generating your AI resume review...</p>
          <p className="text-sm text-gray-400">This usually takes 10-20 seconds</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-full mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Resume Review</h2>
        <p className="text-gray-600">
          AI-powered analysis complete. Download your detailed report below.
        </p>
      </div>

      {paymentData?.payment?.txHash && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
          <p className="text-sm font-semibold text-green-900">Payment transaction</p>
          <a
            href={`https://basescan.org/tx/${paymentData.payment.txHash}`}
            target="_blank"
            rel="noreferrer"
            className="mt-1 block break-all text-sm text-primary-700 hover:text-primary-800"
          >
            {paymentData.payment.txHash}
          </a>
        </div>
      )}

      {/* Overall Score */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 mb-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-primary-100 text-sm font-medium mb-1">Overall Score</p>
            <p className="text-5xl font-bold">{reviewData.overallScore}/100</p>
          </div>
          <div className="text-right">
            <p className="text-primary-100 text-sm">ResumePay AI Rating</p>
            <p className="text-2xl font-semibold mt-1">
              {reviewData.overallScore >= 80 ? 'Excellent' : reviewData.overallScore >= 60 ? 'Good' : 'Needs Improvement'}
            </p>
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <ScoreCard label="ATS" score={reviewData.atsScore} />
        <ScoreCard label="Keywords" score={reviewData.keywordScore} />
        <ScoreCard label="Grammar" score={reviewData.grammarScore} />
        <ScoreCard label="Formatting" score={reviewData.formattingScore} />
        <ScoreCard label="Role Fit" score={reviewData.roleFitScore} />
      </div>

      {/* Strengths */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-green-600" />
          <span>Strengths</span>
        </h3>
        <div className="bg-green-50 rounded-lg p-4 space-y-2">
          {reviewData.strengths.map((strength: string, index: number) => (
            <div key={index} className="flex items-start space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-gray-700 text-sm">{strength}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Weaknesses */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <span>Areas for Improvement</span>
        </h3>
        <div className="bg-amber-50 rounded-lg p-4 space-y-2">
          {reviewData.weaknesses.map((weakness: string, index: number) => (
            <div key={index} className="flex items-start space-x-2">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-gray-700 text-sm">{weakness}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Suggestions */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Suggestions</h3>
        <div className="bg-blue-50 rounded-lg p-4 space-y-2">
          {reviewData.suggestions.map((suggestion: string, index: number) => (
            <div key={index} className="flex items-start space-x-2">
              <div className="h-5 w-5 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">
                {index + 1}
              </div>
              <p className="text-gray-700 text-sm">{suggestion}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-2">ATS Optimization</h4>
          <p className="text-sm text-gray-600">{reviewData.atsOptimization}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-2">Recruiter Perspective</h4>
          <p className="text-sm text-gray-600">{reviewData.recruiterPerspective}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={downloadReport}
          disabled={downloading}
          className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {downloading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              <span>Downloading...</span>
            </>
          ) : (
            <>
              <Download className="h-5 w-5" />
              <span>Download PDF Report</span>
            </>
          )}
        </button>
        <button
          onClick={onReset}
          className="flex-1 bg-gray-100 text-gray-900 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
        >
          <RefreshCw className="h-5 w-5" />
          <span>Review Another Resume</span>
        </button>
      </div>
    </div>
  );
}

function ScoreCard({ label, score }: { label: string; score: number }) {
  const getColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-amber-600 bg-amber-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 text-center">
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${getColor(score).split(' ')[0]}`}>{score}</p>
      <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${getColor(score).split(' ')[1]} transition-all duration-500`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
