import './DPprojects.css'

export default function DPprojects() {
  const projects = [
    {
      name: 'INTERCONTINENTAL เสม็ดนางชี พังงา',
      location: '● สำรวจน้ำ ● บนภูเขา ● ติดทะเล',
      planWidth: '40%',
      actualWidth: '30%',
    },
    {
      name: 'SK FACTORY ปากซัน ลาว',
      location: '● สำรวจ ● เจาะน้ำบาดาล ● ต่างประเทศ',
      planWidth: '30%',
      actualWidth: '25%',
    },
  ]

  return (
    <div className="projects-container">
      <div className="table-head ">
        <div className="project-name">
          <h2>รายการ</h2>
        </div>
        <div className="project-location">
          <h2>สถานที่ตั้ง</h2>
        </div>
        <div className="project-plan row">
          <div className="project-plan month1 row">
            <h2>มกราคม</h2>
          </div>
          <div className="project-plan month2 row">
            <h2>กุมภาพันธ์</h2>
          </div>
          <div className="project-plan month3 row">
            <h2>มีนาคม</h2>
          </div>
        </div>
      </div>
      {projects.map((project, index) => (
        <div className="project row" key={index}>
          <div className="project-name">{project.name}</div>
          <div className="project-location">{project.location}</div>
          <div className="project-plan col">
            <div className="project-action-plan row">
              <div
                className="bar plan"
                style={{ width: project.planWidth }}
              ></div>
            </div>
            <div className="project-actual-work row">
              <div
                className="bar actual"
                style={{ width: project.actualWidth }}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
