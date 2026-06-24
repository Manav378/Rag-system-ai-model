import PDFParser from "pdf2json";



const extractTextFromPDF = (filePath) => {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser()

    pdfParser.on('pdfParser_dataReady', (pdfData) => {
      // Extract all text from the pages
      const text = pdfData.Pages.map(page =>
        page.Texts.map(t => 
        t.R.map(r => r.T).join('')
        ).join(' ')
      ).join('\n')

      resolve(text)
    })

    pdfParser.on('pdfParser_dataError', (error) => {
      reject(error)
    })

    pdfParser.loadPDF(filePath)
  })
}
export default extractTextFromPDF