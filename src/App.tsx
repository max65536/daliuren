import { useState } from 'react';
import './App.css';
import { generateDivinationResult } from './utils/calculation/plate-calculation';
import { getCurrentChineseDateTime, formatChineseDateTime } from './utils/calendar/lunar-calendar';
import type { DivinationRequest, DivinationResult } from './types/divination';

function App() {
  const [result, setResult] = useState<DivinationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [datetime, setDatetime] = useState(new Date());
  const [question, setQuestion] = useState('');
  const [category, setCategory] = useState<'事业' | '财运' | '感情' | '健康' | '学业' | '其他'>('其他');

  const handleDivination = async () => {
    setLoading(true);
    
    try {
      const request: DivinationRequest = {
        datetime,
        question: question || undefined,
        category
      };
      
      const divinationResult = generateDivinationResult(request);
      setResult(divinationResult);
    } catch (error) {
      console.error('占卜计算错误:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentTime = getCurrentChineseDateTime();

  return (
    <div className="app">
      <header className="app-header">
        <h1>大六壬起课</h1>
        <p className="subtitle">传统中国占卜术数应用</p>
      </header>

      <main className="app-main">
        <div className="divination-form">
          <h2>起课设置</h2>
          
          <div className="form-group">
            <label htmlFor="datetime">选择时间：</label>
            <input
              id="datetime"
              type="datetime-local"
              value={datetime.toISOString().slice(0, 16)}
              onChange={(e) => setDatetime(new Date(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">占问类别：</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as typeof category)}
            >
              <option value="事业">事业</option>
              <option value="财运">财运</option>
              <option value="感情">感情</option>
              <option value="健康">健康</option>
              <option value="学业">学业</option>
              <option value="其他">其他</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="question">占问内容（可选）：</label>
            <textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="请输入您想要占问的具体内容..."
              rows={3}
            />
          </div>

          <button 
            className="btn-primary divination-btn"
            onClick={handleDivination}
            disabled={loading}
          >
            {loading ? '起课中...' : '开始起课'}
          </button>
        </div>

        <div className="current-time">
          <h3>当前时间信息</h3>
          <pre className="time-display">
            {formatChineseDateTime(currentTime)}
          </pre>
        </div>

        {result && (
          <div className="divination-result">
            <h2>占卜结果</h2>
            
            <div className="result-summary">
              <div className="confidence">
                <span>可信度：</span>
                <div className="confidence-bar">
                  <div 
                    className="confidence-fill"
                    style={{ width: `${result.confidence * 100}%` }}
                  />
                </div>
                <span>{Math.round(result.confidence * 100)}%</span>
              </div>
            </div>

            <div className="result-content">
              <div className="general-interpretation">
                <h3>总体解释</h3>
                <p>{result.interpretation.general}</p>
              </div>

              <div className="detailed-analysis">
                <h3>详细分析</h3>
                <ul>
                  {result.interpretation.detailed.map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>
              </div>

              {result.interpretation.suggestions.length > 0 && (
                <div className="suggestions">
                  <h3>建议</h3>
                  <ul>
                    {result.interpretation.suggestions.map((suggestion, index) => (
                      <li key={index} className="suggestion-item">{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.interpretation.warnings.length > 0 && (
                <div className="warnings">
                  <h3>注意事项</h3>
                  <ul>
                    {result.interpretation.warnings.map((warning, index) => (
                      <li key={index} className="warning-item">{warning}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="plate-info">
              <h3>盘面信息</h3>
              <div className="plate-summary">
                <div className="ganzhi-info">
                  <span>日干支：{result.pan.metadata.ganZhi.day.gan}{result.pan.metadata.ganZhi.day.zhi}</span>
                  <span>时干支：{result.pan.metadata.ganZhi.hour.gan}{result.pan.metadata.ganZhi.hour.zhi}</span>
                </div>
                <div className="term-info">
                  <span>节气：{result.pan.metadata.solarTerm}</span>
                  <span>农历：{result.pan.metadata.lunarDate}</span>
                </div>
                <div className="spirit-info">
                  <span>贵人位：{result.pan.shenPan.guiRenPosition}</span>
                  <span>三传：
                    {result.pan.renPan.sanChuan.chu.shen} → 
                    {result.pan.renPan.sanChuan.zhong.shen} → 
                    {result.pan.renPan.sanChuan.mo.shen}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>大六壬起课应用 - 传承传统文化，仅供学习研究使用</p>
      </footer>
    </div>
  );
}

export default App;
