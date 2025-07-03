'use client'
import './MonthSelectBtn.css'
import { thaiMonths } from '@/constants/thaiMonths'

type MonthSelectBtnProps = {
  monthSelect: number
  setMonthSelect: (value: number) => void
  yearSelect: number
  setYearSelect: (value: number) => void
  monthCount: number
  setMonthCount: (value: number) => void
}

export default function MonthSelectBtn({
  monthSelect,
  setMonthSelect,
  yearSelect,
  setYearSelect,
  monthCount,
  setMonthCount,
}: MonthSelectBtnProps) {
  const year = yearSelect

  const handleTodayClick = () => {
    const today = new Date()
    setMonthSelect(today.getMonth()) // 0-indexed: 0 = January
    setYearSelect(today.getFullYear()) // Gregorian year
    setMonthCount(1)
  }

  return (
    <>
      <div className="month-year-select-btn">
        <button onClick={handleTodayClick} className="today-btn" >
          ไปที่เดือนนี้
        </button>

        <div className="month-select-btn">
          <button
            onClick={() => setMonthSelect(Math.max(0, monthSelect - 1))}
            disabled={monthSelect === 0 || monthCount === 12}
          >
            ◀
          </button>

          <strong style={{ margin: '0 1rem' }}>
            {thaiMonths[monthSelect]}
          </strong>

          <button
            onClick={() => setMonthSelect(Math.min(11, monthSelect + 1))}
            disabled={monthSelect === 11 || monthCount === 12}
          >
            ▶
          </button>
        </div>

        <div className="year-select-btn">
          <button
            onClick={() => setYearSelect(Math.max(0, yearSelect - 1))}
            disabled={yearSelect === 0}
          >
            ◀
          </button>

          <strong style={{ margin: '0 1rem' }}>{year + 543}</strong>

          <button
            onClick={() => setYearSelect(Math.min(3000, yearSelect + 1))}
            disabled={yearSelect === 3000}
          >
            ▶
          </button>
        </div>
      </div>
    </>
  )
}
