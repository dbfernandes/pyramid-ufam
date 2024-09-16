import { useEffect, useState } from "react";
import axios from "axios";
import { formatCpf, getFilename } from "utils";

// Shared
import { H6 } from "components/shared/Titles";
import { Info, CollapseDetailsStyled, UserProfilePicture } from "components/shared/Table";

// Custom
import UserActions from "../UserActions";
import { FileInfo } from "../styles";

export default function CollapseDetails({ submission, userLogged, onChange }) {
  const isAdmin = userLogged?.userTypeId !== 3;

  const [fileSize, setFileSize] = useState<string>("");
  async function getFileSize(fileUrl) {
    try {
      const response = await axios.head(fileUrl);
      const contentLength = response.headers['content-length'];
      if (contentLength) {
        const length = response.headers["content-length"];
        const size = Math.round(parseInt(length) / 1024);

        if (size > 1024) {
          setFileSize(`${(size / 1024).toFixed(2)} MB`);
          return;
        }

        setFileSize(`${size.toString()} KB`);
      }
    } catch (error) {
      console.error('Error fetching file size:', error);
    }
  }

  useEffect(() => {
    if (submission) {
      getFileSize(submission.fileUrl);
    }
  }, [submission]);

  function getCpf(_user) {
    return _user?.cpf ? formatCpf(_user?.cpf) : "-"
  }

  return (
    <CollapseDetailsStyled admin={isAdmin}>
      <div className="grid">
        {(isAdmin && submission.user) && (
          <Info>
            <H6>Aluno</H6>

            <UserProfilePicture
              big={true}
              src={submission?.user?.profileImage && submission?.user?.profileImage.length > 0
                ? submission?.user?.profileImage
                : `${process.env.img}/user.png`
              }
              alt={submission?.user?.name}
              onError={({ currentTarget }) => {
                currentTarget.src = `${process.env.img}/user.png`;
              }}
            />
            <p><b>Nome:</b> {submission.user.name}</p>
            <p><b>Email:</b> {submission.user.email}</p>
            {submission.user?.cpf && (
              <p><b>CPF:</b> {getCpf(submission.user)}</p>
            )}
            <p><b>Curso:</b> {submission.user.course}</p>
            <p><b>Matrícula:</b> {submission.user?.enrollment}</p>
          </Info>
        )}

        <Info>
          <H6>Atividade</H6>

          <p><b>Grupo de atividade:</b> {submission.activity.activityGroup.name}</p>
          <p><b>Tipo de atividade:</b> {submission.activity.name}</p>
          <p><b>Descrição:</b> {submission.description}</p>
          <p><b>Horas solicitadas:</b> {submission.workload}h</p>
        </Info>

        <FileInfo>
          <H6>Arquivo(s)</H6>

          <a href={submission.fileUrl} target="_blank" rel="noopener noreferrer">
            <i className="bi bi-filetype-pdf" />

            <div>
              <p>{getFilename(submission.fileUrl)}</p>
              <p><span>{fileSize}</span></p>

              <i className="bi bi-box-arrow-up-right" />
            </div>
          </a>
        </FileInfo>
      </div>

      <UserActions
        submission={submission}
        userLogged={userLogged}
        onChange={onChange}
      />
    </CollapseDetailsStyled>
  );
}