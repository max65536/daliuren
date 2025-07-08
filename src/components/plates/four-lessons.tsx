/**
 * 四课三传组件
 * Four Lessons and Three Transmissions Component
 */

import React from 'react';
import type { SiKe, SanChuan } from '../../types/divination';
import './plates.css';

interface FourLessonsProps {
  siKe: SiKe;
  sanChuan: SanChuan;
}

const FourLessons: React.FC<FourLessonsProps> = ({ siKe, sanChuan }) => {
  const lessons = [
    { name: '一课', data: siKe.first },
    { name: '二课', data: siKe.second },
    { name: '三课', data: siKe.third },
    { name: '四课', data: siKe.fourth },
  ];

  const transmissions = [
    { name: '初传', data: sanChuan.chu },
    { name: '中传', data: sanChuan.zhong },
    { name: '末传', data: sanChuan.mo },
  ];

  return (
    <div className="four-lessons">
      <h3>四课三传</h3>
      
      {/* 四课 */}
      <div className="lessons-section">
        <h4>四课</h4>
        <div className="lessons-grid">
          {lessons.map((lesson, index) => (
            <div key={lesson.name} className="lesson-card">
              <div className="lesson-header">
                <span className="lesson-name">{lesson.name}</span>
                <span className="lesson-position">第{lesson.data.position}位</span>
              </div>
              <div className="lesson-content">
                <div className="ganzhi-pair">
                  <span className="gan">{lesson.data.gan}</span>
                  <span className="zhi">{lesson.data.zhi}</span>
                </div>
                <div className="spirit-info">
                  <span className="spirit-name">{lesson.data.shen}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 三传 */}
      <div className="transmissions-section">
        <h4>三传</h4>
        <div className="transmissions-flow">
          {transmissions.map((transmission, index) => (
            <React.Fragment key={transmission.name}>
              <div className="transmission-card">
                <div className="transmission-header">
                  <span className="transmission-name">{transmission.name}</span>
                </div>
                <div className="transmission-content">
                  <div className="transmission-zhi">
                    <span className="zhi-large">{transmission.data.zhi}</span>
                  </div>
                  <div className="transmission-spirit">
                    <span className="spirit-name">{transmission.data.shen}</span>
                  </div>
                  <div className="transmission-meaning">
                    <span className="meaning-text">{transmission.data.meaning}</span>
                  </div>
                </div>
              </div>
              {index < transmissions.length - 1 && (
                <div className="transmission-arrow">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 12H19M19 12L12 5M19 12L12 19"
                      stroke="var(--color-primary)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 四课统计 */}
      <div className="lessons-stats">
        <h4>四课分析</h4>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">重复情况</span>
            <span className="stat-value">{getRepeatStatus(siKe)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">起传方法</span>
            <span className="stat-value">{getTransmissionMethod(siKe)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">吉凶倾向</span>
            <span className="stat-value">{getOverallTendency(siKe, sanChuan)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// 获取重复状态
function getRepeatStatus(siKe: SiKe): string {
  const lessons = [siKe.first, siKe.second, siKe.third, siKe.fourth];
  const uniqueSpirits = new Set(lessons.map(l => `${l.zhi}-${l.shen}`));
  
  switch (uniqueSpirits.size) {
    case 4: return '四课无重';
    case 3: return '一重一空';
    case 2: return '二重二空';
    case 1: return '四课皆重';
    default: return '三重一空';
  }
}

// 获取起传方法
function getTransmissionMethod(siKe: SiKe): string {
  const lessons = [siKe.first, siKe.second, siKe.third, siKe.fourth];
  const uniqueSpirits = new Set(lessons.map(l => `${l.zhi}-${l.shen}`));
  
  switch (uniqueSpirits.size) {
    case 4: return '贼克法';
    case 3: return '涉害法';
    case 2: return '遥克法';
    default: return '昴星法';
  }
}

// 获取总体倾向
function getOverallTendency(siKe: SiKe, sanChuan: SanChuan): string {
  const auspiciousSpirits = ['贵人', '六合', '青龙', '太常', '天后'];
  const inauspiciousSpirits = ['腾蛇', '朱雀', '勾陈', '天空', '白虎', '玄武'];
  
  const allSpirits = [
    siKe.first.shen, siKe.second.shen, siKe.third.shen, siKe.fourth.shen,
    sanChuan.chu.shen, sanChuan.zhong.shen, sanChuan.mo.shen
  ];
  
  const auspiciousCount = allSpirits.filter(s => auspiciousSpirits.includes(s)).length;
  const inauspiciousCount = allSpirits.filter(s => inauspiciousSpirits.includes(s)).length;
  
  if (auspiciousCount > inauspiciousCount) return '偏吉';
  if (inauspiciousCount > auspiciousCount) return '偏凶';
  return '中平';
}

export default FourLessons;
