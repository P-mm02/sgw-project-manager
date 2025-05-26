'use client'
import React from 'react'
import './MonthBtnCtrl.css'


type BtnCtrlProps = {
  monthCount: number
  setMonthCount: (count: number) => void
}


export default function BtnCtrl({ monthCount, setMonthCount }: BtnCtrlProps) {
  
  const options = [1, 3, 6, 12]

  return (
    <div className="row-btn">
      {options.map((count) => (
        <button
          key={count}
          onClick={() => setMonthCount(count)}
          className={monthCount === count ? 'active' : ''}
        >
          {count} เดือน
        </button>
      ))}
    </div>
  )
}
