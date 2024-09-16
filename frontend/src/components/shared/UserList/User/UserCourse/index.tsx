import { OverlayTrigger, Tooltip } from "react-bootstrap"

// Custom
import { Ribbon } from "../styles";

// Interfaces
import IUser from "interfaces/IUser"
import IUserLogged from "interfaces/IUserLogged"
interface IUserCoursesProps {
  user: IUser | IUserLogged | null
}

export default function UserCourses({ user }: IUserCoursesProps) {
  function CoursesColumnTooltip({ courses }) {
    return (
      <>
        {courses.map((course, index) => <p key={index} style={{ margin: 0 }}>{course.name}</p>)}
      </>
    );
  }

  return (<OverlayTrigger placement="bottom" overlay={<Tooltip><CoursesColumnTooltip courses={user?.courses} /></Tooltip>}>
    <span>
      {user?.courses && user?.courses.length > 0 && user?.courses[0]?.name
        ? (<div className="text-with-ribbon">
          <span>{user?.courses[0]?.name}</span>
          {(user?.courses && user?.courses?.length > 1) &&
            <Ribbon>+{user?.courses?.length - 1}</Ribbon>
          }
        </div>)
        : "-"
      }
    </span>
  </OverlayTrigger>
  )
}