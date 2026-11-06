// components/common/MonacoCodeEditor.tsx
import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { 
  Play, 
  RotateCcw, 
  Copy, 
  Check, 
  Terminal, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Code,
  Moon,
  Sun,
  Maximize2,
  Minimize2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { runPythonCode, runPythonTestCase } from '../../utils/pythonRunner';

interface TestCase {
  id: string;
  name: string;
  input: string;
  expectedOutput: string;
  description: string;
}

interface MonacoCodeEditorProps {
  initialCode: string;
  starterCode?: string;
  language?: string;
  height?: string;
  readOnly?: boolean;
  testCases?: TestCase[];
  onCodeChange?: (code: string) => void;
  onRunSuccess?: (output: string) => void;
}

export const MonacoCodeEditor: React.FC<MonacoCodeEditorProps> = ({
  initialCode,
  starterCode,
  language = 'python',
  height = '420px',
  readOnly = false,
  testCases = [],
  onCodeChange,
  onRunSuccess
}) => {
  const [code, setCode] = useState<string>(initialCode);
  const [theme, setTheme] = useState<'vs-dark' | 'light'>('vs-dark');
  const [logs, setLogs] = useState<{ type: 'log' | 'error' | 'success' | 'info'; text: string }[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'console' | 'tests'>('console');
  const [testResults, setTestResults] = useState<{ id: string; passed: boolean; actualOutput: string }[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleEditorChange = (value: string | undefined) => {
    const newCode = value || '';
    setCode(newCode);
    if (onCodeChange) {
      onCodeChange(newCode);
    }
  };

  const runCode = async () => {
    setIsRunning(true);
    setLogs([]);
    setActiveTab('console');

    try {
      const res = await runPythonCode(code);
      setLogs(res.logs);
      if (!res.error && onRunSuccess) {
        onRunSuccess(res.output);
      }
    } catch (err: any) {
      setLogs([
        { type: 'error', text: `❌ حدث خطأ أثناء التشغيل: ${err.message || err}` }
      ]);
    } finally {
      setIsRunning(false);
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setActiveTab('tests');
    const results: { id: string; passed: boolean; actualOutput: string }[] = [];

    for (const tc of testCases) {
      const result = await runPythonTestCase(code, tc.input, tc.expectedOutput);
      results.push({
        id: tc.id,
        passed: result.passed,
        actualOutput: result.actualOutput
      });
    }

    setTestResults(results);
    setIsRunning(false);

    if (results.every(r => r.passed)) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 }
      });
    }
  };

  const resetCode = () => {
    if (starterCode && window.confirm('هل تريد استعادة الكود الأولي للمشروع؟ سيتم استبدال الكود الحالي.')) {
      setCode(starterCode);
      if (onCodeChange) onCodeChange(starterCode);
      setLogs([{ type: 'info', text: 'تمت استعادة قالب الكود الأولي للمشروع.' }]);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex flex-col bg-white rounded-xl overflow-hidden border border-[#83C5BE] shadow-lg ${isFullscreen ? 'fixed inset-4 z-50 h-[calc(100vh-2rem)]' : ''}`}>
      {/* Editor Top Toolbar */}
      <div className="bg-white px-4 py-2.5 flex items-center justify-between border-b border-[#83C5BE] text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono text-[#E29578] font-semibold">
            <Code className="w-4 h-4 text-[#006D77]" />
            <span>محرر Monaco Editor</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-white text-[#006D77] border border-[#83C5BE] font-bold">
              Python 3.x 🐍
            </span>
          </div>

          <div className="h-4 w-px bg-white mx-1"></div>

          <button
            onClick={() => setTheme(theme === 'vs-dark' ? 'light' : 'vs-dark')}
            className="text-[#E29578] hover:text-[#E29578] transition-colors flex items-center gap-1 p-1 rounded hover:bg-white cursor-pointer"
            title="تبديل مظهر المحرر"
          >
            {theme === 'vs-dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{theme === 'vs-dark' ? 'فاتح' : 'داكن'}</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {starterCode && (
            <button
              onClick={resetCode}
              disabled={readOnly}
              className="px-2.5 py-1 rounded bg-white hover:bg-white text-[#E29578] transition-colors flex items-center gap-1 font-medium disabled:opacity-50 cursor-pointer"
              title="إعادة تعيين الكود للقالب الأولي"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">إعادة تعيين</span>
            </button>
          )}

          <button
            onClick={copyCode}
            className="px-2.5 py-1 rounded bg-white hover:bg-white text-[#E29578] transition-colors flex items-center gap-1 font-medium cursor-pointer"
            title="نسخ الكود"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#006D77]" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'تم النسخ' : 'نسخ'}</span>
          </button>

          {testCases.length > 0 && (
            <button
              onClick={runAllTests}
              disabled={isRunning}
              className="px-3 py-1 rounded bg-[#006D77] hover:bg-[#E29578] text-white font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>فحص الاختبارات ({testCases.length})</span>
            </button>
          )}

          <button
            onClick={runCode}
            disabled={isRunning}
            className="px-4 py-1.5 rounded-lg bg-[#006D77] hover:bg-white text-[#006D77] font-bold transition-all shadow-md shadow-[#004D54]/40 flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{isRunning ? 'جارٍ تشغيل بايثون...' : 'تشغيل الكود (Run)'}</span>
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="text-[#E29578] hover:text-[#E29578] p-1.5 rounded hover:bg-white transition-colors cursor-pointer"
            title={isFullscreen ? 'تصغير' : 'ملء الشاشة'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Code Editor Body */}
      <div className="relative font-mono" dir="ltr">
        <Editor
          height={isFullscreen ? 'calc(100vh - 280px)' : height}
          language={language}
          value={code}
          theme={theme}
          options={{
            readOnly,
            fontSize: 14,
            fontFamily: "'Fira Code', Consolas, Monaco, monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            lineNumbers: 'on',
            tabSize: 2,
            wordWrap: 'on',
            padding: { top: 12, bottom: 12 }
          }}
          onChange={handleEditorChange}
        />
      </div>

      {/* Output Console & Test Results Panel */}
      <div className="border-t border-[#83C5BE] bg-white flex flex-col text-xs font-mono">
        {/* Panel Tabs */}
        <div className="flex items-center justify-between px-4 py-1.5 border-b border-[#83C5BE] bg-white">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('console')}
              className={`flex items-center gap-1.5 px-2 py-1 rounded transition-colors cursor-pointer ${
                activeTab === 'console' ? 'bg-white text-[#006D77] font-bold' : 'text-[#E29578] hover:text-[#E29578]'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>شاشة المخرجات (Console)</span>
              {logs.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white text-[#E29578]">
                  {logs.length}
                </span>
              )}
            </button>

            {testCases.length > 0 && (
              <button
                onClick={() => setActiveTab('tests')}
                className={`flex items-center gap-1.5 px-2 py-1 rounded transition-colors cursor-pointer ${
                  activeTab === 'tests' ? 'bg-white text-[#006D77] font-bold' : 'text-[#E29578] hover:text-[#E29578]'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>حالات الاختبار ({testCases.length})</span>
              </button>
            )}
          </div>

          <button
            onClick={() => setLogs([])}
            className="text-[11px] text-[#E29578] hover:text-[#E29578] cursor-pointer"
          >
            مسح المخرجات
          </button>
        </div>

        {/* Content Area */}
        <div className="p-3 max-h-48 overflow-y-auto space-y-1.5" dir="ltr">
          {activeTab === 'console' && (
            <>
              {logs.length === 0 ? (
                <div className="text-[#E29578] text-center py-4 font-sans text-xs" dir="rtl">
                  اضغط على زر <strong className="text-[#006D77]">"تشغيل الكود"</strong> لرؤية المخرجات والنتائج هنا.
                </div>
              ) : (
                logs.map((log, index) => (
                  <div
                    key={index}
                    className={`leading-relaxed ${
                      log.type === 'error'
                        ? 'text-[#F5A9A9] bg-[#3B1515]/60 p-1 rounded border border-[#6B2424]'
                        : log.type === 'success'
                        ? 'text-[#006D77] bg-white/60 p-1 rounded'
                        : log.type === 'info'
                        ? 'text-[#93D7E8] font-sans'
                        : 'text-[#E0EBE2]'
                    }`}
                  >
                    {log.text}
                  </div>
                ))
              )}
            </>
          )}

          {activeTab === 'tests' && (
            <div className="space-y-2" dir="rtl">
              {testCases.map((tc, idx) => {
                const res = testResults.find(r => r.id === tc.id);
                return (
                  <div key={tc.id} className="p-2.5 rounded-lg bg-white border border-[#83C5BE] text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-[#E0EBE2]">{tc.name}</span>
                      {res ? (
                        res.passed ? (
                          <span className="inline-flex items-center gap-1 text-[#006D77] font-bold bg-white px-2 py-0.5 rounded border border-[#83C5BE]">
                            <CheckCircle2 className="w-3.5 h-3.5" /> ناجح
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[#F5A9A9] font-bold bg-[#3B1515] px-2 py-0.5 rounded border border-[#6B2424]">
                            <XCircle className="w-3.5 h-3.5" /> غير مطابق
                          </span>
                        )
                      ) : (
                        <span className="text-[#E29578]">في الانتظار</span>
                      )}
                    </div>
                    <p className="text-[#E29578] text-[11px] mb-1">{tc.description}</p>
                    <div className="font-mono text-[11px] text-[#006D77] bg-white p-1.5 rounded" dir="ltr">
                      Input: {tc.input}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
