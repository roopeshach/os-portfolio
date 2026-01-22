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
    
    // Projects (New format)
    const projects = [
      {
        name: 'PortfolioOS',
        title: 'Portfolio OS',
        tagline: 'A Web-based Operating System Experience',
        tags: ['React', 'TypeScript', 'Redux', 'Styled Components'],
        description: 'A fully functional desktop environment running in the browser. Features a virtual file system, window management, and terminal emulation.',
        features: ['Window Management', 'Virtual File System', 'Terminal with Commands', 'Theme System'],
        stats: [
          { label: 'Lines of Code', value: '5,000+' },
          { label: 'Components', value: '40+' },
          { label: 'Performance', value: '60 FPS' }
        ]
      },
      {
        name: 'E-Commerce',
        title: 'Neon Shop',
        tagline: 'Next-Gen Shopping Experience',
        tags: ['Next.js', 'Stripe', 'Tailwind'],
        description: 'A modern e-commerce platform with real-time inventory and secure payments.',
        features: ['Real-time Cart', 'Stripe Integration', 'Admin Dashboard'],
        stats: [
          { label: 'Products', value: '1,000+' },
          { label: 'Transactions', value: '500/day' },
          { label: 'Uptime', value: '99.9%' }
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
