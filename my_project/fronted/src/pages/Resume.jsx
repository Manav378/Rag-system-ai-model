import React from 'react'
import { useState } from 'react'
import { Upload, FileText, CheckCircle, XCircle, Lightbulb, AlertCircle, Target } from 'lucide-react'
import { toast } from 'react-toastify'
import api from '../api/axios'
import { useTheme } from '../context/ThemeContext'
import { useDocuments } from '../context/DocumentContext'

const Resume = () => {

  const { theme } = useTheme()
  const [dragging, setDragging] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const { activeTab, setActiveTab,
    analyzeResult, setAnalyzeResult,
    matchResult, setmatchResult,
    file, setFile,
    jobDesc, setJobDesc, resetAll } = useDocuments()

  //File select

  const handleFile = (selectedFile) => {
    
    if (!selectedFile) return;
    if (selectedFile.type !== 'application/pdf') {
      toast.error('only upload PDF!')
      return
    }
    setFile(selectedFile)
    resetAll()
  }


  // Drag & Drop
  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]  // ← yeh missing tha
    handleFile(file)
  }

  // Analyze Resume
  const handleAnalyze = async () => {
   
    if (!file) return toast.error("Please upload resume first!")
    setAnalyzing(true)

    try {
      const formData = new FormData()
      formData.append('resume', file)
      const res = await api.post('/resume/analyzeResume', formData)
      setAnalyzeResult(res.data.analysis)
    } catch (error) {
      toast.error('Analysis failed!')
    } finally {
      setAnalyzing(false)
    }
  }


  //JD match

  const handleMatch = async () => {
    if (!file) return toast.error('Upload your resume first!')
    if (!jobDesc.trim()) return toast.error('Past job description!')
    setAnalyzing(true)

    try {
      const formData = new FormData()
      formData.append('resume', file)
      formData.append('jobDescription', jobDesc)
      const res = await api.post("/resume/MatchWithJD", formData)
      setmatchResult(res.data.matchResult)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setAnalyzing(false)
    }
  }


  // Score Color
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }


  //score Ring Color
  const getRingColor = (score) => {
    if (score >= 80) return 'stroke-green-400'
    if (score >= 60) return 'stroke-yellow-400'
    return 'stroke-red-400'
  }


  //score Circle svg

  const ScoreCircle = ({ score }) => {
    const radius = 40
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (score / 100) * circumference

    return (
      <div className="relative flex items-center justify-center w-25 h-25">
        <svg width="100" height="100" className="-rotate-90 absolute">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="#374151" strokeWidth="8" />
          <circle
            cx="50" cy="50" r={radius}
            fill="none"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={`${getRingColor(score)} transition-all duration-1000`}
          />
        </svg>
        {/* Text center mein */}
        <div className="flex flex-col items-center justify-center z-10">
          <span className={`text-2xl font-bold ${getScoreColor(score)}`}>{score}</span>
          <span className="text-xs text-gray-500">/100</span>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-0">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Resume Analyzer</h1>
        <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          ATS Score check karo aur job description se match karo
        </p>
      </div>

      {/* Tabs — full width on mobile so both tabs are easy to tap, auto width from sm up */}
      <div className={`flex gap-1 p-1 rounded-xl w-full sm:w-fit mb-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
        {['analyze', 'match'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 sm:flex-none px-3 sm:px-5 py-2 rounded-lg text-sm font-medium transition capitalize
              ${activeTab === tab
                ? 'bg-violet-600 text-white'
                : theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            {tab === 'analyze' ? '📊 ATS Analyze' : '🎯 JD Match'}
          </button>
        ))}
      </div>

      {/* Upload Area — less padding on mobile */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-5 sm:p-8 text-center mb-4 transition
          ${dragging
            ? 'border-violet-500 bg-violet-500/10'
            : theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
          }`}
      >
        {file ? (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
            <FileText size={24} className="text-violet-400" />
            <span className="font-medium truncate max-w-full">{file.name}</span>
            <button
              onClick={() => setFile(null)}
              className="text-red-400 text-sm hover:text-red-300"
            >
              Remove
            </button>
          </div>
        ) : (
          <div
            className="cursor-pointer flex flex-col items-center gap-3"
            onClick={() => document.getElementById('resumeInput').click()}
          >
            <Upload size={32} className="text-violet-400" />
            <p className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Resume PDF drop karo ya click karo
            </p>
            <input
              id="resumeInput"
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => {
                const selected = e.target.files[0]
                handleFile(selected)
                e.target.value = '' // reset karo
              }}
            />
          </div>
        )}
      </div>

      {/* JD Input — Sirf match tab mein */}
      {activeTab === 'match' && (
        <textarea
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
          placeholder="Job Description yahan paste karo..."
          rows={5}
          className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none resize-none mb-4
            ${theme === 'dark'
              ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-500'
              : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
            }`}
        />
      )}

      {/* Analyze Button */}
      <button
        onClick={activeTab === 'analyze' ? handleAnalyze : handleMatch}
        disabled={analyzing}
        className="w-full py-3 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-xl font-semibold transition mb-8"
      >
        {analyzing
          ? '⏳ Analyzing...'
          : activeTab === 'analyze' ? '🔍 Resume Analyze Karo' : '🎯 JD se Match Karo'
        }
      </button>

      {/* ── ANALYZE RESULT ── */}
      {analyzeResult && activeTab === 'analyze' && (
        <div className="flex flex-col gap-4">

          {/* Score + Feedback — stacks on mobile so the score circle isn't squeezed beside text */}
          <div className={`p-4 sm:p-6 rounded-2xl border ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6 text-center sm:text-left">
              <div className="relative flex items-center justify-center">
                <ScoreCircle score={analyzeResult.atsScore} />
              </div>
              <div>
                <h2 className="text-lg font-bold mb-1">
                  ATS Score: <span className={getScoreColor(analyzeResult.atsScore)}>{analyzeResult.atsScore}/100</span>
                </h2>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {analyzeResult.overallFeedback}
                </p>
              </div>
            </div>
          </div>

          {/* Sections Check */}
          <div className={`p-4 sm:p-5 rounded-2xl border ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
            <h3 className="font-semibold mb-3">📋 Sections Check</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(analyzeResult.sections).map(([key, value]) => (
                <span
                  key={key}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium
                    ${value
                      ? 'bg-green-500/10 text-green-400'
                      : 'bg-red-500/10 text-red-400'
                    }`}
                >
                  {value ? <CheckCircle size={12} /> : <XCircle size={12} />}
                  {key.replace('has', '')}
                </span>
              ))}
            </div>
          </div>

          {/* Strengths + Weaknesses — already responsive grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 sm:p-5 rounded-2xl border ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <CheckCircle size={16} className="text-green-400" /> Strengths
              </h3>
              <ul className="flex flex-col gap-2">
                {analyzeResult.strengths.map((s, i) => (
                  <li key={i} className={`text-sm flex items-start gap-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    <span className="text-green-400 mt-0.5">•</span> {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className={`p-4 sm:p-5 rounded-2xl border ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <XCircle size={16} className="text-red-400" /> Weaknesses
              </h3>
              <ul className="flex flex-col gap-2">
                {analyzeResult.weaknesses.map((w, i) => (
                  <li key={i} className={`text-sm flex items-start gap-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    <span className="text-red-400 mt-0.5">•</span> {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Missing Keywords */}
          <div className={`p-4 sm:p-5 rounded-2xl border ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <AlertCircle size={16} className="text-yellow-400" /> Missing Keywords
            </h3>
            <div className="flex flex-wrap gap-2">
              {analyzeResult.missingKeywords.map((k, i) => (
                <span key={i} className="px-3 py-1 bg-yellow-500/10 text-yellow-400 rounded-full text-xs font-medium">
                  {k}
                </span>
              ))}
            </div>
          </div>

          {/* Suggestions */}
          <div className={`p-4 sm:p-5 rounded-2xl border ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Lightbulb size={16} className="text-violet-400" /> Suggestions
            </h3>
            <ul className="flex flex-col gap-2">
              {analyzeResult.suggestions.map((s, i) => (
                <li key={i} className={`text-sm flex items-start gap-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  <span className="text-violet-400 mt-0.5">→</span> {s}
                </li>
              ))}
            </ul>
          </div>

        </div>
      )}

      {/* ── MATCH RESULT ── */}
      {matchResult && activeTab === 'match' && (
        <div className="flex flex-col gap-4">

          {/* Match Score — stacks on mobile */}
          <div className={`p-4 sm:p-6 rounded-2xl border ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6 text-center sm:text-left">
              <div className="relative flex items-center justify-center">
                <ScoreCircle score={matchResult.matchScore} />
              </div>
              <div>
                <h2 className="text-lg font-bold mb-1">
                  Match Score: <span className={getScoreColor(matchResult.matchScore)}>{matchResult.matchScore}/100</span>
                </h2>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {matchResult.summary}
                </p>
              </div>
            </div>
          </div>

          {/* Matched + Missing Skills — already responsive grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 sm:p-5 rounded-2xl border ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <CheckCircle size={16} className="text-green-400" /> Matched Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {matchResult.matchedSkills.map((s, i) => (
                  <span key={i} className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className={`p-4 sm:p-5 rounded-2xl border ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Target size={16} className="text-red-400" /> Missing Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {matchResult.missingSkills.map((s, i) => (
                  <span key={i} className="px-3 py-1 bg-red-500/10 text-red-400 rounded-full text-xs font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className={`p-4 sm:p-5 rounded-2xl border ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Lightbulb size={16} className="text-violet-400" /> Recommendations
            </h3>
            <ul className="flex flex-col gap-2">
              {matchResult.recommendations.map((r, i) => (
                <li key={i} className={`text-sm flex items-start gap-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  <span className="text-violet-400 mt-0.5">→</span> {r}
                </li>
              ))}
            </ul>
          </div>

        </div>
      )}
    </div>
  )
}

export default Resume