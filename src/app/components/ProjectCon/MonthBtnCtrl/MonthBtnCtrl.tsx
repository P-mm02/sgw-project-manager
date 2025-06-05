'use client'
import { useEffect } from 'react'
import './MonthBtnCtrl.css'


type BtnCtrlProps = {
  monthCount: number
  setMonthCount: (count: number) => void
  setMonthSelect: (value: number) => void
}


export default function BtnCtrl({ monthCount, setMonthCount, setMonthSelect }: BtnCtrlProps) {
  const options = [1, 3, 6, 12]
  const handleClick = (count: number) => {
    setMonthCount(count)
    if (count === 12) {
      setMonthSelect(0)
    }
  }
  return (
    <div className="row-btn">
      {options.map((count) => (
        <button
          key={count}
          onClick={() => handleClick(count)}
          className={monthCount === count ? 'active' : ''}
        >
          {count} เดือน
        </button>
      ))}
    </div>
  )
}
