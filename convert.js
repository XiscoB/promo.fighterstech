const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const imgDir = path.join(__dirname, 'img');
const backupDir = path.join(__dirname, 'img_source');

async function processImages() {
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
  }

  const files = fs.readdirSync(imgDir);

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
      const srcPath = path.join(imgDir, file);
      const filename = path.basename(file, ext);
      const destPath = path.join(imgDir, `${filename}.webp`);
      const backupPath = path.join(backupDir, file);

      try {
        await sharp(srcPath)
          .webp({ quality: 85 })
          .toFile(destPath);
        
        console.log(`Converted: ${file} -> ${filename}.webp`);

        // Move original to backup
        fs.renameSync(srcPath, backupPath);
        console.log(`Backed up: ${file} to img_source/`);
      } catch (err) {
        console.error(`Error processing ${file}:`, err);
      }
    }
  }
}

processImages();
