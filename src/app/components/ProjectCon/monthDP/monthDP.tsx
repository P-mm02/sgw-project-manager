import { thaiMonths } from '@/constants/thaiMonths'
import './monthDP.css'
type MonthDPProps = {
  monthCount: number,
}

export default function MonthDP({ monthCount }: MonthDPProps) {
  return (
    <>
      {thaiMonths.slice(0, monthCount).map((month, index) => (
        <div key={index} className="project-plan-month">
          <h3 className="month-header">{month}</h3>
        </div>
      ))}
    </>
  )
}
