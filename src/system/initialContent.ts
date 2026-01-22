import { mkdir, writeFile, exists } from './FileSystem';

const bio = `
Roopesh Acharya
Software Engineer specializing in building scalable web applications with deep engagement in Artificial Intelligence (AI) and Machine Learning (ML).

Professional Summary:
Roopesh Acharya is a versatile and passionate Software Engineer with expertise in full-stack development, AI/ML integration, and automation solutions. With a proven track record of building scalable, efficient, and secure applications, he brings a diverse skill set that bridges theoretical knowledge and real-world application.

Location: Nepal
LinkedIn: https://www.linkedin.com/in/rupeshach/
GitHub: https://github.com/roopeshach
Website: https://roopeshachrya.com.np
`;

const skills = `
Programming Languages:
- Python (Backend, AI/ML)
- JavaScript/TypeScript (Full Stack)
- PHP (Backend)
- Dart (Mobile)
- HTML5 & CSS3
- C#

AI/ML Technologies:
- TensorFlow, Keras, scikit-learn
- Computer Vision, Predictive Modeling

Web Frameworks:
- Django, Flask, FastAPI
- React, Next.js, Vue.js
- Node.js

DevOps & Infrastructure:
- Docker, Kubernetes
- CI/CD (GitHub Actions)
- Linux
`;

const projects = [
  {
    name: "Django Application Builder",
    desc: "Automation tool that streamlines Django application development with auth and API generation.",
    tech: "Python, Django, DRF",
  },
  {
    name: "Enterprise Backend Infrastructure",
    desc: "Full-scale backend system powering enterprise management solutions.",
    tech: "TypeScript, Node.js, PostgreSQL",
  },
  {
    name: "AI-Powered Security Extension",
    desc: "Intelligent phishing detection system protecting users in real-time.",
    tech: "Python, JS, ML",
  },
  {
    name: "Handwritten Digit Recognition",
    desc: "Advanced ML project for image classification using CNNs.",
    tech: "Python, TensorFlow",
  },
  {
    name: "Chess Engine Prototype",
    desc: "Core chess game mechanics implementation.",
    tech: "Algorithm Design",
  },
];

export const initializeContent = async () => {
  try {
    const rootExists = await exists('/Users');
    if (rootExists) {
      console.log('Filesystem already populated.');
      return;
    }

    console.log('Populating filesystem...');

    await mkdir('/Users');
    await mkdir('/Users/Roopesh');
    await mkdir('/Users/Roopesh/Desktop');
    await mkdir('/Users/Roopesh/Documents');
    await mkdir('/Users/Roopesh/Projects');
    await mkdir('/Users/Roopesh/Downloads');
    await mkdir('/Users/Roopesh/Pictures');

    // Documents
    await writeFile('/Users/Roopesh/Documents/Bio.txt', bio);
    await writeFile('/Users/Roopesh/Documents/Skills.txt', skills);
    
    // Projects
    for (const proj of projects) {
      const content = `# ${proj.name}

**Tech Stack:** ${proj.tech}

## Description
${proj.desc}

## Features
- Scalable architecture
- Modern UI/UX
- Performance optimized
`;
      await writeFile(`/Users/Roopesh/Projects/${proj.name}.md`, content);
    }

    // Desktop Shortcuts (files for now)
    await writeFile('/Users/Roopesh/Desktop/ReadMe.md', "# Welcome to Roopesh's Portfolio OS!\n\nDouble click icons to open apps.\nRight click to create files.");
    await writeFile('/Users/Roopesh/Desktop/Resume.link', "https://www.linkedin.com/in/rupeshach/");
    await writeFile('/Users/Roopesh/Desktop/Bio.txt', bio);
    await writeFile('/Users/Roopesh/Desktop/Skills.txt', skills);
    
    // Create Projects folder on Desktop for easy access
    await mkdir('/Users/Roopesh/Desktop/Projects');
    for (const proj of projects) {
      const content = `# ${proj.name}

**Tech Stack:** ${proj.tech}

## Description
${proj.desc}
`;
      await writeFile(`/Users/Roopesh/Desktop/Projects/${proj.name}.md`, content);
    }

    console.log('Filesystem population complete.');
  } catch (err) {
    console.error('Error populating filesystem:', err);
  }
};
