const canvas = document.getElementById('quoteCard');
const ctx = canvas.getContext('2d');

const adjustmentValue = -11;
const adjustedCenter = (canvas.width / 2) + adjustmentValue;

const maxWidth = 1170; // Max width of text on image
const lineHeight = 90; // Space between lines

document.getElementById('imageUpload').addEventListener('change', function () {
    const file = this.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Dim the image
            ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        img.src = e.target.result;
    }

    reader.readAsDataURL(file);
});

function generateCard() {
    const quote = document.getElementById('quote').value;
    const author = `- ${document.getElementById('author').value}`;

    // Reset canvas
    const currentImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(currentImage, 0, 0);

    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    // Calculate total height for both quote and author (including line breaks)
    ctx.font = 'italic 72px Roboto';
    ctx.fillStyle = 'white';
    let quoteLines = getLines(ctx, quote, maxWidth);
    ctx.font = '72px Roboto';
    let authorLines = getLines(ctx, author, maxWidth);

    let totalLines = quoteLines.concat(authorLines);
    let totalHeight = totalLines.length * lineHeight;

    // Calculate starting y-coordinate to center the entire block of text
    let startY = (canvas.height - totalHeight) / 2 + lineHeight / 2;

    // Render the main quote in italics
    ctx.font = 'italic 72px Roboto';
    for (let i = 0; i < quoteLines.length; i++) {
        ctx.fillText(quoteLines[i], adjustedCenter, startY + (i * lineHeight));
    }

    // Render the author's name below the quote in non-italics
    ctx.font = '72px Roboto';
    for (let i = 0; i < authorLines.length; i++) {
        ctx.fillText(authorLines[i], canvas.width / 2, startY + (quoteLines.length + i) * lineHeight);
    }
}

function getLines(context, text, maxWidth) {
    let words = text.split(' ');
    let line = '';
    let lines = [];

    for (let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + ' ';
        let metrics = context.measureText(testLine);
        let testWidth = metrics.width;

        if (testWidth > maxWidth && n > 0) {
            lines.push(line.trim());
            line = words[n] + ' ';
        } else {
            line = testLine;
        }
    }
    lines.push(line.trim());

    return lines;
}

