import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { openProcess } from '../store/processSlice';
import { readdir, readFile, path as pathModule } from '../system/FileSystem';
import { motion } from 'framer-motion';
import { Code, ArrowRight } from 'lucide-react';

const Container = styled.div`
  height: 100%;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Header = styled.div`
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-family: 'Rajdhani', sans-serif;
  text-transform: uppercase;
  color: ${props => props.theme.colors.accent};
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

const ProjectCard = styled(motion.div)`
  background: ${props => props.theme.colors.windowBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
  overflow: hidden;
  transition: all 0.2s;

  &:hover {
    border-color: ${props => props.theme.colors.accent};
    box-shadow: 0 0 15px rgba(0, 216, 255, 0.1);
    transform: translateY(-2px);
  }
`;

const ProjectTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  color: ${props => props.theme.colors.text};
`;

const ProjectTagline = styled.p`
  margin: 0;
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.4;
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: auto;
`;

const Tag = styled.span`
  background: rgba(255, 255, 255, 0.05);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  color: #aaa;
`;

interface ProjectData {
  name?: string; // Internal name from filename
  title: string;
  tagline: string;
  tags: string[];
}

const ProjectNavigator: React.FC = () => {
  const dispatch = useDispatch();
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const projectsDir = '/Users/Roopesh/Desktop/Projects';
        
        // Ensure directory exists, if not, wait or retry?
        // Actually, if we just booted, it might take a ms.
        // Let's try to read.
        
        let files: string[] = [];
        try {
           files = await readdir(projectsDir);
        } catch (e) {
           console.warn('Projects directory not found, retrying...', e);
           await new Promise(resolve => setTimeout(resolve, 1000));
           try {
              files = await readdir(projectsDir);
           } catch (e2) {
              console.error('Projects directory failed to load', e2);
              setLoading(false);
              return;
           }
        }

        const projectFiles = files.filter(f => f.endsWith('.project'));
        
        const loadedProjects: ProjectData[] = [];
        
        for (const file of projectFiles) {
          try {
            const content = await readFile(pathModule.join(projectsDir, file));
            const data = JSON.parse(content);
            loadedProjects.push({ ...data, name: file.replace('.project', '') });
          } catch (e) {
            console.error(`Failed to load project ${file}`, e);
          }
        }
        
        setProjects(loadedProjects);
      } catch (e) {
        console.error('Failed to scan projects directory', e);
      } finally {
        setLoading(false);
      }
    };
    
    loadProjects();
  }, []);

  const openProject = (projectName: string) => {
    dispatch(openProcess({
      appId: 'Project Viewer',
      title: projectName,
      icon: '/assets/icons/folder.svg',
      componentName: 'Project Viewer',
      initialProps: { path: `/Users/Roopesh/Desktop/Projects/${projectName}.project` }
    }));
  };

  if (loading) return <Container>Scanning sectors...</Container>;

  return (
    <Container>
      <Header>
        <Title>
          <Code size={24} /> Project Sector
        </Title>
        <div style={{ fontSize: 12, color: '#666' }}>
          /Users/Roopesh/Desktop/Projects
        </div>
      </Header>

      <Grid>
        {projects.map((proj, i) => (
          <ProjectCard
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              if (proj.name) openProject(proj.name);
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <ProjectTitle>{proj.title}</ProjectTitle>
            <ProjectTagline>{proj.tagline}</ProjectTagline>
            
            <TagContainer>
              {proj.tags.slice(0, 3).map(tag => (
                <Tag key={tag}>{tag}</Tag>
              ))}
              {proj.tags.length > 3 && <Tag>+{proj.tags.length - 3}</Tag>}
            </TagContainer>
            
            <div style={{ position: 'absolute', bottom: 10, right: 10, opacity: 0.3 }}>
              <ArrowRight size={16} />
            </div>
          </ProjectCard>
        ))}
        {projects.length === 0 && (
          <div style={{ color: '#666', gridColumn: '1/-1', textAlign: 'center' }}>
            No project data modules found.
          </div>
        )}
      </Grid>
    </Container>
  );
};

export default ProjectNavigator;
