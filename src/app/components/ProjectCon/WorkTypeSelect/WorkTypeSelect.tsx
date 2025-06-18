'use client'
import './WorkTypeSelect.css'

type WorkTypeSelectProps = {
  setWorkType: (value: string) => void
}

export default function WorkTypeSelect({ setWorkType }: WorkTypeSelectProps) {
  return (
    <div className="workType-select-Con">
      <button className="workType-btn" onClick={() => setWorkType('all')}>
        ทั้งหมด
      </button>
      <button className="workType-btn" onClick={() => setWorkType('drilling')}>
        งานเจาะ
      </button>
      <button className="workType-btn" onClick={() => setWorkType('survey')}>
        งานสำรวจ
      </button>
      <button
        className="workType-btn"
        onClick={() => setWorkType('dewatering')}
      >
        งานสูบลดระดับน้ำ
      </button>
      <button
        className="workType-btn"
        onClick={() => setWorkType('maintenance')}
      >
        งานซ่อมบำรุง
      </button>
      <button className="workType-btn" onClick={() => setWorkType('others')}>
        งานอื่นๆ
      </button>
    </div>
  )
}
