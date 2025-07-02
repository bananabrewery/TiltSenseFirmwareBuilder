import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface YamlViewerProps {
  code: string;
  maxHeight?: number;
}

export const YamlViewer: React.FC<YamlViewerProps> = ({ code, maxHeight = 600 }) => {
  return (
    <>
      <SyntaxHighlighter
        language="yaml"
        style={darcula}
        customStyle={{
          maxHeight,
          overflowY: 'auto',
          backgroundColor: 'transparent',
        }}
      >
        {code}
      </SyntaxHighlighter>
    </>
  );
};
