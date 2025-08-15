export const convertFileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const generateBookCoverPlaceholder = (title: string, author: string): string => {
  const canvas = document.createElement('canvas');
  canvas.width = 300;
  canvas.height = 450;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  
  // Gradient background
  const gradient = ctx.createLinearGradient(0, 0, 0, 450);
  const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];
  const randomColor1 = colors[Math.floor(Math.random() * colors.length)];
  const randomColor2 = colors[Math.floor(Math.random() * colors.length)];
  
  gradient.addColorStop(0, randomColor1);
  gradient.addColorStop(1, randomColor2);
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 300, 450);
  
  // Title
  ctx.fillStyle = 'white';
  ctx.font = 'bold 28px serif';
  ctx.textAlign = 'center';
  
  const words = title.split(' ');
  let y = 150;
  let line = '';
  
  for (let word of words) {
    const testLine = line + word + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > 260 && line !== '') {
      ctx.fillText(line, 150, y);
      line = word + ' ';
      y += 35;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, 150, y);
  
  // Author
  ctx.font = '18px sans-serif';
  ctx.fillText(author, 150, y + 60);
  
  return canvas.toDataURL();
};