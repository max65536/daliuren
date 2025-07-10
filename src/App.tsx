import { useState } from 'react';
import './App.css';
import { calculateFromStrings } from './utils/calculation/four-lessons';
import { getCurrentChineseDateTime, formatChineseDateTime } from './utils/calendar/lunar-calendar';

function App() {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [datetime, setDatetime] = useState(new Date());
  const [question, setQuestion] = useState('');
  const [category, setCategory] = useState<'事业' | '财运' | '感情' | '健康' | '学业' | '其他'>('其他');
  const [dayGanZhi, setDayGanZhi] = useState('丁未');
  const [hourGanZhi, setHourGanZhi] = useState('戊申');
  const [yueJiang, setYueJiang] = useState('未');

  const handleDivination = async () => {
    setLoading(true);
    
    try {
      // 使用新的四课算法
      const hour = datetime.getHours();
      const divinationResult = calculateFromStrings(dayGanZhi, hourGanZhi, yueJiang, hour);
      setResult(divinationResult);
    } catch (error) {
      console.error('占卜计算错误:', error);
      setResult(`错误：${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setLoading(false);
    }
  };

  const currentTime = getCurrentChineseDateTime();

  return (
    <div className="app">
      <header className="app-header">
        <h1>易瑞笔记 六壬排盘</h1>
        <p className="subtitle">传统大六壬起课应用</p>
      </header>

      <main className={`app-main ${result ? 'result-mode' : ''}`}>
        {!result && (
        <div className="divination-form">
          <h2>起课参数</h2>
          
          <div className="form-group">
            <label htmlFor="datetime">选择时间：</label>
            <input
              id="datetime"
              type="datetime-local"
              value={datetime.toISOString().slice(0, 16)}
              onChange={(e) => setDatetime(new Date(e.target.value))}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dayGanZhi">日干支：</label>
              <input
                id="dayGanZhi"
                type="text"
                value={dayGanZhi}
                onChange={(e) => setDayGanZhi(e.target.value)}
                placeholder="如：丁未"
                maxLength={2}
              />
            </div>

            <div className="form-group">
              <label htmlFor="hourGanZhi">时干支：</label>
              <input
                id="hourGanZhi"
                type="text"
                value={hourGanZhi}
                onChange={(e) => setHourGanZhi(e.target.value)}
                placeholder="如：戊申"
                maxLength={2}
              />
            </div>

            <div className="form-group">
              <label htmlFor="yueJiang">月将：</label>
              <select
                id="yueJiang"
                value={yueJiang}
                onChange={(e) => setYueJiang(e.target.value)}
              >
                <option value="子">子</option>
                <option value="丑">丑</option>
                <option value="寅">寅</option>
                <option value="卯">卯</option>
                <option value="辰">辰</option>
                <option value="巳">巳</option>
                <option value="午">午</option>
                <option value="未">未</option>
                <option value="申">申</option>
                <option value="酉">酉</option>
                <option value="戌">戌</option>
                <option value="亥">亥</option>
              </select>
            </div>
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
        )}

        {!result && (
        <div className="current-time">
          <h3>当前时间信息</h3>
          <pre className="time-display">
            {formatChineseDateTime(currentTime)}
          </pre>
        </div>
        )}

        {result && (
          <div className="divination-result">
            <div className="result-header">
              <h2>大六壬排盘结果</h2>
              {question && (
                <div className="question-info">
                  <strong>占问：</strong>{question} ({category})
                </div>
              )}
            </div>
            
            <div className="traditional-plate">
              <pre className="plate-content">
                {result}
              </pre>
            </div>

            <div className="result-actions">
              <button 
                className="btn-secondary"
                onClick={() => navigator.clipboard?.writeText(result)}
              >
                复制结果
              </button>
              <button 
                className="btn-secondary"
                onClick={() => setResult(null)}
                style={{ marginLeft: '1rem' }}
              >
                重新起课
              </button>
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
