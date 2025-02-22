// src/components/CodeEditor.jsx
import { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';

function CodeEditor({ code, onChange, language, disabled, onRun }) {
  const editorRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      editorRef.current = monaco.editor.create(containerRef.current, {
        value: code,
        language: language,
        theme: 'vs-dark',
        automaticLayout: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        fontSize: 14,
        lineNumbers: 'on',
        readOnly: disabled,
        renderLineHighlight: 'all',
        roundedSelection: true,
        selectOnLineNumbers: true,
        wordWrap: 'on'
      });

      editorRef.current.onDidChangeModelContent(() => {
        onChange(editorRef.current.getValue());
      });

      return () => {
        editorRef.current.dispose();
      };
    }
  }, [containerRef, language, disabled]);

  useEffect(() => {
    if (editorRef.current) {
      if (editorRef.current.getValue() !== code) {
        editorRef.current.setValue(code);
      }
    }
  }, [code]);

  const handleRun = () => {
    onRun(code, language);
  };

  return ( 
    <div>
      <button 
        className="btn-primary run-btn" 
        onClick={handleRun} 
        disabled={disabled}
      >
        Run Code
      </button>
      <div
        ref={containerRef} 
        className="code-editor-container" 
        style={{ height: '500px', width: '100%', border: '1px solid #ccc', boxSizing: 'border-box' }}
      />
    </div>
  );
}

export default CodeEditor;
