import React from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor: React.FC<{ initialCode?: string, language?: string }> = ({ initialCode = '// Type code here', language = 'javascript' }) => {
  return (
    <div style={{ height: '100%' }}>
      <Editor
        height="100%"
        defaultLanguage={language}
        defaultValue={initialCode}
        theme="vs-dark"
        options={{ minimap: { enabled: false } }}
      />
    </div>
  );
};

export default CodeEditor;
