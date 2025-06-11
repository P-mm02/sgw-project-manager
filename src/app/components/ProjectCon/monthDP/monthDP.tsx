import { thaiMonths } from '@/constants/thaiMonthShort'
import './monthDP.css'
type MonthDPProps = {
  monthCount: number
  monthSelect: number
}


export default function MonthDP({ monthCount, monthSelect}: MonthDPProps) {
  return (
    <>
      {thaiMonths.slice(monthSelect, monthSelect+monthCount).map((month, index) => (
        <div key={index} className="project-plan-month">
          <h3 className="month-header">{month}</h3>
        </div>
      ))}
    </>
  )
}
