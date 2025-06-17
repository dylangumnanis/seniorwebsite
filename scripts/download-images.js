const https = require('https');
const fs = require('fs');
const path = require('path');

const images = [
  {
    url: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21',
    filename: 'hero-bg.jpg',
  },
  {
    url: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21',
    filename: 'mission-image.jpg',
  },
  {
    url: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21',
    filename: 'testimonials/sarah.jpg',
  },
  {
    url: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21',
    filename: 'testimonials/michael.jpg',
  },
  {
    url: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21',
    filename: 'about-hero.jpg',
  },
  {
    url: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21',
    filename: 'about-story.jpg',
  },
];

const downloadImage = (url, filename) => {
  return new Promise((resolve, reject) => {
    const filepath = path.join(__dirname, '..', 'public', filename);
    const file = fs.createWriteStream(filepath);

    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${filename}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
};

const downloadAllImages = async () => {
  for (const image of images) {
    try {
      await downloadImage(image.url, image.filename);
    } catch (error) {
      console.error(`Error downloading ${image.filename}:`, error);
    }
  }
};

downloadAllImages(); 