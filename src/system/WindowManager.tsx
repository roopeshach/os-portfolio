import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import WindowFrame from '../components/WindowFrame';
import { AppRegistry } from '../apps/registry';

const WindowManager: React.FC = () => {
  const processes = useSelector((state: RootState) => state.process.processes);

  return (
    <>
      {Object.values(processes).map((process) => {
        const AppComponent = AppRegistry[process.componentName];
        if (!AppComponent) return null;

        return (
          <WindowFrame
            key={process.id}
            id={process.id}
            title={process.title}
            icon={process.icon}
          >
            <Suspense fallback={<div>Loading...</div>}>
              <AppComponent {...process.initialProps} />
            </Suspense>
          </WindowFrame>
        );
      })}
    </>
  );
};

export default WindowManager;
