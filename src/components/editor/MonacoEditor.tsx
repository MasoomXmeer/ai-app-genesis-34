
import React, { useRef, useEffect } from 'react';
import Editor, { loader } from '@monaco-editor/react';

// Configure Monaco Editor
loader.init().then((monacoInstance) => {
  // Add custom themes
  monacoInstance.editor.defineTheme('lovable-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '6A9955' },
      { token: 'keyword', foreground: '569CD6' },
      { token: 'string', foreground: 'CE9178' },
      { token: 'number', foreground: 'B5CEA8' },
      { token: 'type', foreground: '4EC9B0' },
    ],
    colors: {
      'editor.background': '#0f0f23',
      'editor.foreground': '#d4d4d4',
      'editor.lineHighlightBackground': '#2d2d30',
      'editor.selectionBackground': '#264f78',
      'editorCursor.foreground': '#d4d4d4',
    }
  });

  monacoInstance.editor.defineTheme('lovable-light', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '008000' },
      { token: 'keyword', foreground: '0000FF' },
      { token: 'string', foreground: 'A31515' },
      { token: 'number', foreground: '098658' },
      { token: 'type', foreground: '267F99' },
    ],
    colors: {
      'editor.background': '#ffffff',
      'editor.foreground': '#000000',
      'editor.lineHighlightBackground': '#f0f0f0',
      'editor.selectionBackground': '#add6ff',
    }
  });
});

interface MonacoEditorProps {
  value: string;
  language: string;
  onChange: (value: string) => void;
  onSave?: () => void;
  theme?: 'light' | 'dark';
  readOnly?: boolean;
  minimap?: boolean;
}

export const MonacoEditor: React.FC<MonacoEditorProps> = ({
  value,
  language,
  onChange,
  onSave,
  theme = 'dark',
  readOnly = false,
  minimap = true
}) => {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;

    // Add save keyboard shortcut
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      onSave?.();
    });

    // Configure editor options
    editor.updateOptions({
      fontSize: 14,
      fontFamily: 'JetBrains Mono, Consolas, Monaco, monospace',
      lineHeight: 1.6,
      minimap: { enabled: minimap },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      formatOnPaste: true,
      formatOnType: true,
      automaticLayout: true,
      suggestOnTriggerCharacters: true,
      quickSuggestions: true,
      parameterHints: { enabled: true },
      bracketPairColorization: { enabled: true },
    });

    // Add custom TypeScript definitions for React
    if (language === 'typescript' || language === 'javascript') {
      monaco.languages.typescript.typescriptDefaults.addExtraLib(
        `
        declare module "react" {
          export = React;
          export as namespace React;
          namespace React {
            interface Component<P = {}, S = {}> {}
            interface ComponentClass<P = {}> {}
            interface FunctionComponent<P = {}> {}
            interface ReactElement<P = any> {}
            function createElement<P>(type: any, props?: P, ...children: any[]): ReactElement<P>;
            function useState<T>(initialState: T | (() => T)): [T, (value: T | ((prev: T) => T)) => void];
            function useEffect(effect: () => void | (() => void), deps?: any[]): void;
            function useCallback<T extends (...args: any[]) => any>(callback: T, deps: any[]): T;
            function useMemo<T>(factory: () => T, deps: any[]): T;
          }
        }
        `,
        'file:///node_modules/@types/react/index.d.ts'
      );
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onChange(value);
    }
  };

  return (
    <Editor
      height="100%"
      language={language}
      value={value}
      onChange={handleEditorChange}
      onMount={handleEditorDidMount}
      theme={theme === 'dark' ? 'lovable-dark' : 'lovable-light'}
      options={{
        readOnly,
        selectOnLineNumbers: true,
        roundedSelection: false,
        cursorStyle: 'line',
        automaticLayout: true,
      }}
    />
  );
};
