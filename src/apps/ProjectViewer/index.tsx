import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { readFile } from '../../system/FileSystem';
import { motion } from 'framer-motion';
import { Code } from 'lucide-react';

const Container = styled.div`
  height: 100%;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  overflow-y: auto;
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HeroSection = styled.div`
  width: 100%;
  max-width: 800px;
  margin-bottom: 40px;
  text-align: center;
`;

const Title = styled(motion.h1)`
  font-size: 48px;
  margin-bottom: 10px;
  background: linear-gradient(90deg, #fff, ${props => props.theme.colors.accent});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: 'Rajdhani', sans-serif;
  text-transform: uppercase;
`;

const Tagline = styled(motion.div)`
  font-size: 18px;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 20px;
`;

const TagContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const Tag = styled.span`
  background: rgba(0, 216, 255, 0.1);
  border: 1px solid rgba(0, 216, 255, 0.3);
  color: ${props => props.theme.colors.accent};
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const ContentSection = styled(motion.div)`
  width: 100%;
  max-width: 800px;
  background: ${props => props.theme.colors.windowBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  line-height: 1.6;
  font-size: 16px;

  h2 {
    color: ${props => props.theme.colors.accent};
    border-bottom: 1px solid rgba(255,255,255,0.1);
    padding-bottom: 10px;
    margin-top: 30px;
  }
  
  ul {
    list-style-type: none;
    padding: 0;
  }
  
  li {
    margin-bottom: 10px;
    padding-left: 20px;
    position: relative;
    &:before {
      content: '>';
      color: ${props => props.theme.colors.accent};
      position: absolute;
      left: 0;
    }
  }
`;

const StatsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  width: 100%;
  max-width: 800px;
  margin-bottom: 40px;
`;

const StatCard = styled.div`
  background: rgba(255,255,255,0.05);
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  border: 1px solid rgba(255,255,255,0.1);
  
  h3 {
    margin: 0;
    font-size: 24px;
    color: ${props => props.theme.colors.text};
  }
  
  p {
    margin: 5px 0 0;
    font-size: 12px;
    color: ${props => props.theme.colors.textSecondary};
    text-transform: uppercase;
  }
`;

interface ProjectData {
  title: string;
  tagline: string;
  tags: string[];
  description: string;
  features: string[];
  stats: { label: string; value: string }[];
}

interface ProjectViewerProps {
  path?: string;
}

const ProjectViewer: React.FC<ProjectViewerProps> = ({ path }) => {
  const [data, setData] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!path) return;
      try {
        const content = await readFile(path);
        const parsed = JSON.parse(content);
        setData(parsed);
      } catch (e) {
        console.error('Failed to load project', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [path]);

  if (loading) return <Container>Loading Project Data...</Container>;
  if (!data) return <Container>Error loading project.</Container>;

  return (
    <Container>
      <HeroSection>
        <Title
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {data.title}
        </Title>
        <Tagline
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {data.tagline}
        </Tagline>
        <TagContainer
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {data.tags.map(tag => (
            <Tag key={tag}><Code size={12} /> {tag}</Tag>
          ))}
        </TagContainer>
      </HeroSection>

      <StatsGrid
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        {data.stats.map((stat, i) => (
          <StatCard key={i}>
            <h3>{stat.value}</h3>
            <p>{stat.label}</p>
          </StatCard>
        ))}
      </StatsGrid>

      <ContentSection
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <h2>About The Project</h2>
        <p>{data.description}</p>

        <h2>Key Features</h2>
        <ul>
          {data.features.map((feat, i) => (
            <li key={i}>{feat}</li>
          ))}
        </ul>
      </ContentSection>
    </Container>
  );
};

export default ProjectViewer;
