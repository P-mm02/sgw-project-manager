// src/app/components/ProjectCon/DateCtrl/MonthSelectBtn/MonthSelectBtn.tsx
'use client'
import React from 'react'
import "./MonthSelectBtn.css";

type MonthSelectBtnProps = {
  monthSelect: number
  setMonthSelect: (value: number) => void
}

export default function MonthSelectBtn({monthSelect, setMonthSelect,}: MonthSelectBtnProps) {
  const year = new Date().getFullYear()
  const monthName = new Date(year, monthSelect , 1).toLocaleString(
    'default',
    {
      month: 'long',
    }
  )

  return (
    <>
    <div className="month-select-btn">
        <button
            onClick={() => setMonthSelect(Math.max(0, monthSelect - 1))}
            disabled={monthSelect === 0}
            >
            ◀
        </button>

            <strong style={{ margin: '0 1rem' }}>
            {monthName} {year}
            </strong>

            <button
            onClick={() => setMonthSelect(Math.min(11, monthSelect + 1))}
            disabled={monthSelect === 11}
            >
            ▶
        </button>
    </div>
    <div className="month-select-btn">
        <button
            onClick={() => setMonthSelect(Math.max(0, monthSelect - 1))}
            disabled={monthSelect === 0}
            >
            ◀
        </button>

            <strong style={{ margin: '0 1rem' }}>
            {monthName} {year}
            </strong>
            <button
            onClick={() => setMonthSelect(Math.min(11, monthSelect + 1))}
            disabled={monthSelect === 11}
            >
            ▶
        </button>
    </div>
    </>    
  )
}
