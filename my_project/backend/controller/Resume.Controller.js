import extractTextFromPDF from "../utils/pdfParser.js";
import askGroq from "../utils/Groq.js";

const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload your resume!" });
    }

    const resumeText = await extractTextFromPDF(req.file.path);

    if (!resumeText || resumeText.trim().length == 0) {
      return res.status(400).json({ message: "Text not extracted from pdf!" });
    }

    const prompt = `
        You are an expert ATS resume analyzer.
Analyze this resume and respond ONLY in valid JSON.

Resume:
${resumeText}
    Return exactly this JSON structure:
{
  "atsScore": <number 0-100>,
  "overallFeedback": "<2-3 line summary>",
  "strengths": ["<s1>", "<s2>", "<s3>"],
  "weaknesses": ["<w1>", "<w2>", "<w3>"],
  "missingKeywords": ["<k1>", "<k2>", "<k3>", "<k4>", "<k5>"],
  "suggestions": ["<s1>", "<s2>", "<s3>"],
  "sections": {
    "hasObjective": <true/false>,
    "hasEducation": <true/false>,
    "hasExperience": <true/false>,
    "hasSkills": <true/false>,
    "hasProjects": <true/false>
  }
}
Only return JSON, nothing else.


        `;

    const result = await askGroq(prompt);
    const cleaned = result.replace(/```json|```/g, "").trim();
    const analysis = JSON.parse(cleaned);

    res.json({ message: "Resume analyzed! ✅", analysis });
  } catch (error) {
     res.status(500).json({ message: 'Error in resume uploading!', error: error.message })
  }
};

const matchWithJD = async (req, res) => {

    try {
        
        const {jobDescription } = req.body;

        if(!req.file){
            return res.status(400).json({
                message:'Please upload your resume!'
            })
        }

        if(!jobDescription){
            return res.status(400).json({message:'Also provide job description'})
        }


        const resumeText = await extractTextFromPDF(req.file.path)

          const prompt = `
You are an expert resume and job description matcher.
Compare this resume with the job description.
Respond ONLY in valid JSON.

Resume:
${resumeText}

Job Description:
${jobDescription}

Return exactly this JSON:
{
  "matchScore": <number 0-100>,
  "matchedSkills": ["<skill1>", "<skill2>", "<skill3>"],
  "missingSkills": ["<skill1>", "<skill2>", "<skill3>"],
  "recommendations": ["<rec1>", "<rec2>", "<rec3>"],
  "summary": "<2-3 line summary>"
}
Only return JSON, nothing else.
`

        const result = await askGroq(prompt);
         const cleaned = result.replace(/```json|```/g, '').trim()
         const matchResult = JSON.parse(cleaned);
          res.json({ message: 'Match analyzed! ✅', matchResult })

    } catch (error) {
        res.status(500).json({ message: 'Error aaya', error: error.message })
        
    }
};

export { analyzeResume, matchWithJD };
