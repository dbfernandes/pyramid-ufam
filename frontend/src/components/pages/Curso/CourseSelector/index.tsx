import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

// Shared
import { H3 } from "components/shared/Titles";
import UserInfo from "components/shared/Header/UserInfo";

// Custom
import EnrollmentGrid from "components/shared/EnrollmentGrid";
import { Container, Wrapper } from "./styles";

// Interface
import { IRootState } from "redux/store";
import IUserLogged from "interfaces/IUserLogged";

export default function CourseSelector() {
  const router = useRouter();
  const user = useSelector<IRootState, IUserLogged>((state) => state.user);

  useEffect(() => {
    if (user.selectedCourse != null) {
      router.replace("/painel");
    }
  }, [user]);

  return (
    <Wrapper>
      <div>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}>
          <Container>
            <H3 style={{ marginBottom: 15 }}>Curso</H3>

            <UserInfo />
          </Container>
        </div>

        <EnrollmentGrid userLogged={user} />
      </div>
    </Wrapper>
  );
}