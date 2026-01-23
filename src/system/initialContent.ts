import { mkdir, writeFile } from './FileSystem';

const bio = `Hi, I'm Roopesh.
I am a Full Stack Developer passionate about building interactive web experiences.`;

const skills = `Frontend:
- React, Vue, Angular
- TypeScript, JavaScript
- Styled Components, Tailwind CSS

Backend:
- Node.js, Express
- Python, Django
- PostgreSQL, MongoDB`;

export const initializeContent = async () => {
  try {
    // Check if initialized
    if (localStorage.getItem('fs_initialized')) {
      console.log('Filesystem already populated.');
      return;
    }

    console.log('Populating filesystem...');

    const safeMkdir = async (path: string) => {
      try {
        await mkdir(path);
      } catch {
        // Ignore if exists
      }
    };

    await safeMkdir('/Users');
    await safeMkdir('/Users/Roopesh');
    await safeMkdir('/Users/Roopesh/Desktop');
    await safeMkdir('/Users/Roopesh/Documents');
    await safeMkdir('/Users/Roopesh/Projects');
    await safeMkdir('/Users/Roopesh/Downloads');
    await safeMkdir('/Users/Roopesh/Pictures');

    // Documents
    await writeFile('/Users/Roopesh/Documents/Bio.txt', bio);
    await writeFile('/Users/Roopesh/Documents/Skills.txt', skills);
    
    // Projects (New format)
    const projects = [
      {
        name: 'SpamDetection',
        title: 'Spam Detection Analysis',
        tagline: 'Advanced Email Filtering with ML',
        tags: ['Python', 'Machine Learning', 'scikit-learn', 'Pandas'],
        description: 'An in-depth machine learning analysis project focused on email spam detection using the UCI Spambase dataset. The project demonstrates comprehensive ML workflow from data preprocessing to model evaluation.',
        features: ['Data Visualization', 'Feature Selection', 'Random Forest Implementation', 'Model Comparison'],
        stats: [
          { label: 'Algorithm', value: 'Random Forest' },
          { label: 'Dataset', value: 'UCI Spambase' },
          { label: 'Precision', value: 'High' }
        ]
      },
      {
        name: 'DigitRecognition',
        title: 'Handwritten Digit Recognition',
        tagline: 'Deep Learning Computer Vision',
        tags: ['Python', 'TensorFlow', 'Keras', 'Computer Vision'],
        description: 'Advanced machine learning project implementing multiple deep learning models for recognizing handwritten digits from images, with comprehensive model comparison.',
        features: ['CNN Implementation', 'Image Preprocessing', 'Hyperparameter Tuning', 'Confusion Matrix Analysis'],
        stats: [
          { label: 'Model', value: 'CNN' },
          { label: 'Framework', value: 'TensorFlow' },
          { label: 'Accuracy', value: '99%+' }
        ]
      },
      {
        name: 'SmartParking',
        title: 'Smart Parking IoT System',
        tagline: 'Real-time Occupancy Detection',
        tags: ['Python', 'Raspberry Pi', 'OpenCV', 'IoT'],
        description: 'IoT-based smart parking system using Raspberry Pi and computer vision to detect parking space occupancy in real-time, with both hardware and simulation modes.',
        features: ['Real-Time Detection', 'Edge Detection', 'Hardware Integration', 'Simulation Mode'],
        stats: [
          { label: 'Platform', value: 'Raspberry Pi' },
          { label: 'Library', value: 'OpenCV' },
          { label: 'Latency', value: 'Low' }
        ]
      },
      {
        name: 'DjangoBuilder',
        title: 'Django Application Builder',
        tagline: 'Automated Backend Generator',
        tags: ['Python', 'Django', 'DRF', 'Automation'],
        description: 'Sophisticated automation tool that revolutionizes Django application development by automatically generating complete Django apps from JSON schema definitions.',
        features: ['Schema to Code', 'Auto API Generation', 'Auth System', 'JSON-Based Defs'],
        stats: [
          { label: 'Time Saved', value: '90%' },
          { label: 'Output', value: 'Full App' },
          { label: 'Stack', value: 'Django/DRF' }
        ]
      },
      {
        name: 'PrismaMigrator',
        title: 'Prisma Migration Manager',
        tagline: 'Safe Database Evolution',
        tags: ['TypeScript', 'Node.js', 'PostgreSQL', 'Prisma'],
        description: 'TypeScript-based CLI tool for managing Prisma migrations with advanced features like pre-migration checks, automatic seeding, and migration tracking.',
        features: ['Auto Seeding', 'Dry Run Mode', 'Schema Validation', 'Rollback Support'],
        stats: [
          { label: 'Safety', value: '100%' },
          { label: 'Type', value: 'CLI Tool' },
          { label: 'DB', value: 'PostgreSQL' }
        ]
      },
      {
        name: 'BSPython',
        title: 'BS-Python Date Converter',
        tagline: 'Nepali Calendar Library',
        tags: ['Python', 'Algorithm', 'Localization'],
        description: 'Python library for converting between Gregorian calendar and Bikram Sambat (Nepali calendar), essential for applications serving Nepali users.',
        features: ['Bidirectional Conversion', 'Historical Accuracy', 'Pure Python', 'Edge Case Handling'],
        stats: [
          { label: 'Accuracy', value: 'High' },
          { label: 'Coverage', value: '1970+' },
          { label: 'Dependencies', value: 'None' }
        ]
      },
      {
        name: 'ChessEngine',
        title: 'Chess Engine Prototype',
        tagline: 'Algorithmic Game Logic',
        tags: ['Python', 'Algorithms', 'AI'],
        description: 'A chess engine prototype demonstrating minimax algorithms, board state evaluation, and move generation logic.',
        features: ['Move Validation', 'Minimax Algorithm', 'Board State Management', 'AI Opponent'],
        stats: [
          { label: 'Logic', value: 'Minimax' },
          { label: 'Language', value: 'Python' },
          { label: 'Complexity', value: 'O(b^d)' }
        ]
      },
      {
        name: 'NullsetVisualizer',
        title: 'Nullset Visualizer',
        tagline: 'Mathematical Data Art',
        tags: ['Python', 'SVG', 'Math'],
        description: 'A tool for visualizing mathematical sets and nullset concepts using SVG generation and Python scripting.',
        features: ['SVG Generation', 'Set Theory', 'Data Viz', 'Python Scripting'],
        stats: [
          { label: 'Output', value: 'SVG' },
          { label: 'Domain', value: 'Math' },
          { label: 'Tech', value: 'Python' }
        ]
      },
      {
        name: 'Quotomation',
        title: 'Python Automation Suite',
        tagline: 'Workflow Automation Tools',
        tags: ['Python', 'Scripting', 'Automation'],
        description: 'A collection of python scripts for automating daily tasks, file management, and data processing.',
        features: ['Task Scheduling', 'File Ops', 'Data Processing', 'Cross-Platform'],
        stats: [
          { label: 'Efficiency', value: 'High' },
          { label: 'Scripts', value: 'Multiple' },
          { label: 'Lang', value: 'Python' }
        ]
      },
      {
        name: 'EMRSystem',
        title: 'Electronic Medical Records',
        tagline: 'Healthcare Management System',
        tags: ['JavaScript', 'TypeScript', 'C#', 'HTML'],
        description: 'A comprehensive EMR system for managing patient records, appointments, and medical history with a secure backend.',
        features: ['Patient Management', 'Secure Records', 'Appointment Scheduling', 'Audit Logs'],
        stats: [
          { label: 'Security', value: 'High' },
          { label: 'Frontend', value: 'React/TS' },
          { label: 'Backend', value: 'C#/.NET' }
        ]
      }
    ];

    await mkdir('/Users/Roopesh/Desktop/Projects');
    
    for (const proj of projects) {
      // Save as .project JSON
      await writeFile(
        `/Users/Roopesh/Desktop/Projects/${proj.name}.project`, 
        JSON.stringify(proj, null, 2)
      );
    }

    console.log('Filesystem population complete.');
  } catch (err) {
    console.error('Error populating filesystem:', err);
  }
};
