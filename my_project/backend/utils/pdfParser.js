import PDFParser from "pdf2json"
import https from 'https'
import http from 'http'
import fs from 'fs'
import path from 'path'
import os from 'os'

// URL se file download karo temp mein
const downloadFile = (url) => {
  return new Promise((resolve, reject) => {
    const tempPath = path.join(os.tmpdir(), `${Date.now()}.pdf`)
    const file = fs.createWriteStream(tempPath)
    const protocol = url.startsWith('https') ? https : http

    protocol.get(url, (response) => {
      response.pipe(file)
      file.on('finish', () => {
        file.close()
        resolve(tempPath)
      })
    }).on('error', reject)
  })
}

const extractTextFromPDF = async (filePath) => {
  let localPath = filePath
  let isTemp = false

  // Agar Cloudinary URL hai toh download karo
  if (filePath.startsWith('http')) {
    localPath = await downloadFile(filePath)
    isTemp = true
  }

  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser()

    pdfParser.on("pdfParser_dataError", (err) => {
      // Temp file delete karo
      if (isTemp && fs.existsSync(localPath)) {
        fs.unlinkSync(localPath)
      }
      reject(err)
    })

    pdfParser.on("pdfParser_dataReady", (pdfData) => {
      let text = ""

      pdfData.Pages.forEach((page) => {
        page.Texts.forEach((item) => {
          item.R.forEach((run) => {
            try {
              text += decodeURIComponent(run.T) + " "
            } catch {
              text += run.T + " "  // decode fail hone pe original use karo
            }
          })
        })
      })

      // Temp file delete karo
      if (isTemp && fs.existsSync(localPath)) {
        fs.unlinkSync(localPath)
      }

      resolve(text.trim())
    })

    pdfParser.loadPDF(localPath)
  })
}

export default extractTextFromPDF