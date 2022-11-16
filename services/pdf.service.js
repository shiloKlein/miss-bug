const PDFDocument = require('pdfkit')
const fs = require('fs')

module.exports = {
    makeBugsPdf,
}


function makeBugsPdf(bugs){
    console.log('bugs from pdf server', bugs);
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream('public/pdf/bugs.pdf'));
    bugs.forEach((bug) => {
        
        // doc.moveDown()
        // doc.fontSize(25)
        // .text(bug.title, 100, 100)
        // doc.moveDown()
        doc.moveDown();
        doc.text(bug.title, {
          width: 410,
          align: 'center'
        }
        );
        
        // Add another page
        // doc.moveDown();
        // doc.text(bug.title, {
        //   width: 410,
        //   align: 'center'
        // }
        // )
    })
    doc.end()
}