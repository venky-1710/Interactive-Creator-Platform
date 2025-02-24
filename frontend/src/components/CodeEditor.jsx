// src/components/CodeEditor.jsx
import { useEffect, useRef, useState } from 'react';
import * as monaco from 'monaco-editor';
import { compileCode } from '../services/challengeService'; // Import the compileCode function

function CodeEditor({ code, onChange, language, disabled }) {
  const [output, setOutput] = useState('');
  const [inputs, setInputs] = useState('');

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

  const handleRun = async () => {
    try {
      const result = await compileCode(code, language, inputs);

      setOutput(result);
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
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
      <div className="input-container" style={{ margin: '10px 0' }}>
        <h3>Input:</h3>
        <textarea
          value={inputs}
          onChange={(e) => setInputs(e.target.value)}
          style={{
            width: '100%',
            minHeight: '50px',
            padding: '8px',
            fontFamily: 'monospace',
            backgroundColor: '#1e1e1e',
            color: '#d4d4d4',
            border: '1px solid #ccc'
          }}
          placeholder="Enter input values here (if needed)"
        />
      </div>
      <div className="output-container">
        <h3>Output:</h3>
        <pre style={{
          backgroundColor: '#1e1e1e',
          color: '#d4d4d4',
          fontFamily: 'monospace',
          padding: '8px',
          border: '1px solid #ccc',
          minHeight: '50px'
        }}>{output}</pre>
      </div>

    </div>
  );
}

export default CodeEditor;
