/**
 * 天地盘组件
 * Heaven and Earth Plate Component
 */

import React from 'react';
import type { TianPan, DiPan } from '../../types/divination';
import { DI_ZHI } from '../../utils/constants/stems-branches';
import './plates.css';

interface HeavenEarthPlateProps {
  tianPan: TianPan;
  diPan: DiPan;
}

const HeavenEarthPlate: React.FC<HeavenEarthPlateProps> = ({ tianPan, diPan }) => {
  // 地支位置映射（按传统排列，子在正北）
  const zhiPositions = [
    { zhi: '子', angle: 0, x: 50, y: 10 },    // 正北
    { zhi: '丑', angle: 30, x: 75, y: 15 },   // 东北偏北
    { zhi: '寅', angle: 60, x: 90, y: 35 },   // 东北偏东
    { zhi: '卯', angle: 90, x: 90, y: 50 },   // 正东
    { zhi: '辰', angle: 120, x: 85, y: 75 },  // 东南偏东
    { zhi: '巳', angle: 150, x: 75, y: 85 },  // 东南偏南
    { zhi: '午', angle: 180, x: 50, y: 90 },  // 正南
    { zhi: '未', angle: 210, x: 25, y: 85 },  // 西南偏南
    { zhi: '申', angle: 240, x: 15, y: 75 },  // 西南偏西
    { zhi: '酉', angle: 270, x: 10, y: 50 },  // 正西
    { zhi: '戌', angle: 300, x: 15, y: 25 },  // 西北偏西
    { zhi: '亥', angle: 330, x: 25, y: 15 },  // 西北偏北
  ];

  return (
    <div className="heaven-earth-plate">
      <h3>天地盘</h3>
      <div className="plate-container">
        <svg viewBox="0 0 300 300" className="plate-svg">
          {/* 外圈 - 地盘 */}
          <circle
            cx="150"
            cy="150"
            r="140"
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="2"
            className="outer-circle"
          />
          
          {/* 内圈 - 天盘 */}
          <circle
            cx="150"
            cy="150"
            r="100"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="2"
            className="inner-circle"
          />
          
          {/* 中心点 */}
          <circle
            cx="150"
            cy="150"
            r="3"
            fill="var(--color-secondary)"
          />
          
          {/* 十二地支位置 */}
          {zhiPositions.map((pos, index) => {
            const angle = (pos.angle - 90) * (Math.PI / 180); // 转换为弧度，调整起始角度
            const outerX = 150 + 130 * Math.cos(angle);
            const outerY = 150 + 130 * Math.sin(angle);
            const innerX = 150 + 90 * Math.cos(angle);
            const innerY = 150 + 90 * Math.sin(angle);
            
            const tianGan = tianPan.positions[pos.zhi as keyof typeof tianPan.positions];
            const diZhi = diPan.positions[pos.zhi as keyof typeof diPan.positions];
            
            return (
              <g key={pos.zhi}>
                {/* 分割线 */}
                <line
                  x1={innerX}
                  y1={innerY}
                  x2={outerX}
                  y2={outerY}
                  stroke="var(--border-primary)"
                  strokeWidth="1"
                  opacity="0.5"
                />
                
                {/* 地支标签（外圈） */}
                <g>
                  <circle
                    cx={outerX}
                    cy={outerY}
                    r="15"
                    fill="var(--bg-surface)"
                    stroke="var(--color-primary)"
                    strokeWidth="2"
                  />
                  <text
                    x={outerX}
                    y={outerY}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="zhi-text"
                    fill="var(--color-primary)"
                  >
                    {diZhi}
                  </text>
                </g>
                
                {/* 天干标签（内圈） */}
                <g>
                  <circle
                    cx={innerX}
                    cy={innerY}
                    r="12"
                    fill="var(--bg-surface)"
                    stroke="var(--color-accent)"
                    strokeWidth="2"
                  />
                  <text
                    x={innerX}
                    y={innerY}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="gan-text"
                    fill="var(--color-accent)"
                  >
                    {tianGan}
                  </text>
                </g>
              </g>
            );
          })}
          
          {/* 方位标识 */}
          <text x="150" y="25" textAnchor="middle" className="direction-text" fill="var(--text-secondary)">北</text>
          <text x="275" y="155" textAnchor="middle" className="direction-text" fill="var(--text-secondary)">东</text>
          <text x="150" y="285" textAnchor="middle" className="direction-text" fill="var(--text-secondary)">南</text>
          <text x="25" y="155" textAnchor="middle" className="direction-text" fill="var(--text-secondary)">西</text>
        </svg>
        
        <div className="plate-legend">
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: 'var(--color-primary)' }}></div>
            <span>地支（地盘）</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: 'var(--color-accent)' }}></div>
            <span>天干（天盘）</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeavenEarthPlate;
