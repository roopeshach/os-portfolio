import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { AppRegistry, AppMetadata } from '../../apps/registry';
import { useDispatch } from 'react-redux';
import { openProcess } from '../../store/processSlice';
import { Search } from 'lucide-react';

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(64, 37, 31, 0.9);
  backdrop-filter: blur(20px);
  z-index: 9995;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 100px;
`;

const SearchContainer = styled.div`
  position: relative;
  width: 300px;
  margin-bottom: 50px;
`;

const SearchInput = styled.input`
  width: 100%;
  background: rgba(191, 191, 191, 0.15);
  border: 1px solid rgba(191, 191, 191, 0.25);
  padding: 12px 40px;
  border-radius: 25px;
  color: #BFBFBF;
  font-size: 16px;
  outline: none;
  
  &::placeholder {
    color: rgba(191, 191, 191, 0.6);
  }
  
  &:focus {
    background: rgba(191, 191, 191, 0.25);
    border-color: ${props => props.theme.colors.accent};
    box-shadow: 0 0 0 3px rgba(206, 217, 121, 0.3);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 40px;
  width: 80%;
  max-width: 1000px;
`;

const AppIcon = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  
  img {
    width: 64px;
    height: 64px;
    filter: drop-shadow(0 4px 12px rgba(0,0,0,0.25));
    transition: transform 0.2s;
  }
  
  span {
    color: #BFBFBF;
    font-size: 14px;
    text-shadow: 0 1px 3px rgba(0,0,0,0.5);
    text-align: center;
  }
  
  &:hover img {
    transform: scale(1.1);
  }
`;

interface LaunchpadProps {
  onClose: () => void;
}

const Launchpad: React.FC<LaunchpadProps> = ({ onClose }) => {
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');

  const apps = Object.keys(AppRegistry).filter(app => 
    app.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpen = (appName: string) => {
    const meta = AppMetadata[appName as keyof typeof AppMetadata];
    dispatch(openProcess({
      appId: appName,
      title: meta?.title || appName,
      icon: meta?.icon || 'assets/icons/default.svg',
      componentName: appName
    }));
    onClose();
  };

  return (
    <Overlay
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <div onClick={e => e.stopPropagation()}>
        <SearchContainer>
          <Search style={{ position: 'absolute', left: 12, top: 12, color: '#aaa' }} size={20} />
          <SearchInput 
            placeholder="Search" 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            autoFocus
          />
        </SearchContainer>
        
        <Grid>
          {apps.map((app) => {
             const meta = AppMetadata[app as keyof typeof AppMetadata];
             return (
               <AppIcon
                 key={app}
                 onClick={() => handleOpen(app)}
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
               >
                <img src={meta?.icon || 'assets/icons/default.svg'} alt={app} onError={(e) => e.currentTarget.style.display = 'none'} />
                 <span>{meta?.title || app}</span>
               </AppIcon>
             );
          })}
        </Grid>
      </div>
    </Overlay>
  );
};

export default Launchpad;
