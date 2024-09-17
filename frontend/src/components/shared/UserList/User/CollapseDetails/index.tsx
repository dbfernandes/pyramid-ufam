import { formatCpf } from "utils";

// Shared
import { H6 } from "components/shared/Titles";
import { CollapseDetailsStyled, Info, UserProfilePicture, ProgressBar } from "components/shared/Table";

// Custom
import { UserStatus } from "../styles";

// Interfaces
import IUser from "interfaces/IUser";
import { getMoreInfo } from "..";
interface ICollapseDetailsProps {
  user: IUser | null;
  courseId?: number | null | undefined;
}

export default function CollapseDetails({ user, courseId }: ICollapseDetailsProps) {
  const more = getMoreInfo(user, courseId);

  function getCpf(user) {
    return user?.cpf ? formatCpf(user?.cpf) : "-"
  }

  return (
    <CollapseDetailsStyled>
      <div className="grid">
        {(user) && (
          <Info>
            <H6>Aluno</H6>

            <UserProfilePicture
              big={true}
              src={user?.profileImage && user?.profileImage.length > 0
                ? user?.profileImage
                : `${process.env.img}/user.png`
              }
              alt={user?.name}
              onError={({ currentTarget }) => {
                currentTarget.src = `${process.env.img}/user.png`;
              }}
            />
            <p><b>Nome:</b> {user.name}</p>
            <p><b>Email:</b> {user.email}</p>
            {user?.cpf && (
              <p><b>CPF:</b> {getCpf(user)}</p>
            )}
            <p>
              <b>Curso(s):</b> {user?.courses && user?.courses.length > 0
                ? (
                  <div className="text-with-ribbon">
                    {user?.courses.map((course, index) => (
                      <><span key={index}>{course.name}</span><br /></>
                    ))}
                  </div>
                )
                : "-"
              }
            </p>
            <p><b>Status:</b> <UserStatus status={user?.isActive}>{user?.isActive === true ? "Ativo" : "Inativo"}</UserStatus></p>
          </Info>

        )}
        {user?.userTypeId === 3 && (
          <Info>
            <H6>Informações do curso</H6>

            <p><b>Matrícula deste curso:</b> {more.enrollment}</p>
            <hr />

            <p><b>Horas (Ensino):</b> {more.workloadCount?.["Ensino"]?.totalWorkload}h</p>
            <p><b>Horas (Pesquisa):</b> {more.workloadCount?.["Pesquisa"]?.totalWorkload}h</p>
            <p><b>Horas (Extensão):</b> {more.workloadCount?.["Extensão"]?.totalWorkload}h</p>
            <hr />

            <div style={{ display: 'flex', flexDirection: 'column', margin: '0' }}>
              <div>
                <b>Total:</b>
              </div>
              <div style={{ width: '100%', marginTop: '8px' }}>
                <ProgressBar current={more.totalWorkload} max={more.minWorkload} />
              </div>
            </div>
            <hr />

            <p><b>Status de Conclusão:</b> {more.isComplete ? 'Carga horária concluída!' : `Faltam ${more.hoursRemaining} horas`}</p>
          </Info>)}
      </div>

    </CollapseDetailsStyled>
  );
}