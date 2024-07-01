import { useEffect, useState } from "react";
import Collapse from 'react-bootstrap/Collapse';
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import axios, { AxiosRequestConfig } from "axios";
import { StatusSubmissions } from "constants/statusSubmissions.constants";
import { formatCpf, getFilename } from "utils";

// Shared
import { H6 } from "components/shared/Titles";
import { toast } from "react-toastify";
import UserActions from "./UserActions";

// Custom
import {
  Item,
  Column,
  CustomFormCheck,
  CheckboxPreventClick,

  SubmissionStatusStyled,
  ColoredBar,

  CollapseDetailsStyled,
  Info,
  FileInfo,
  ItemWrapper,
} from "./styles";

// Interfaces
import IUserLogged from "interfaces/IUserLogged";
import { IRootState } from "redux/store";

interface ISubmissionCardProps {
  submission?: any;
  loading?: boolean;
  header?: boolean;
  checkedIds?: number[];
  setCheckedIds?: React.Dispatch<React.SetStateAction<number[]>>;
  user?: IUserLogged;

  onChange?: Function;
}

export default function SubmissionCard({
  submission = null,
  loading = false,
  header = false,
  checkedIds = [],
  setCheckedIds = () => { },
  user,

  onChange = () => { },

  ...props
}: ISubmissionCardProps) {
  function handleCheck(e) {
    e.stopPropagation();

    let allValues = [];
    const checks = document.getElementsByName("submissions");

    checks.forEach((check) => {
      if ("value" in check && check.value != "all") {
        let _value = parseInt(check.value as string) as never;
        allValues.push(_value);
      }
    });

    if (e.target.value != "all") {
      const value = parseInt(e.target.value);
      const index = checkedIds.indexOf(value);

      // Hardcopying the array
      let _checkedIds = JSON.parse(JSON.stringify(checkedIds));

      if (e.target.checked && index === -1) {
        _checkedIds.push(value);
      } else if (!e.target.checked && index !== -1) {
        _checkedIds.splice(index, 1);
      }

      setCheckedIds(_checkedIds);

      const checkboxAll = document.getElementById("check-all");
      if (checkboxAll != null && "checked" in checkboxAll) {
        checkboxAll.checked = JSON.stringify(_checkedIds.sort()) === JSON.stringify(allValues);
      }
    } else {
      checks.forEach((check) => {
        if ("checked" in check) {
          check["checked"] = e.target.checked;
        }
      });

      setCheckedIds(e.target.checked ? allValues : []);
    }
  }

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

  const [collapsed, setCollapsed] = useState<boolean>(false);
  function CollapseDetails({ submission, user, onChange }) {
    function getCpf(user) {
      return user?.cpf ? formatCpf(user?.cpf) : "-"
    }

    return (
      <CollapseDetailsStyled admin={user?.userTypeId !== 3}>
        <div className="grid">
          {(user?.userTypeId !== 3 && submission.user) && (
            <Info>
              <H6>Aluno</H6>

              <p>
                <b>Nome:</b> {submission.user.name}
              </p>
              <p>
                <b>Email:</b> {submission.user.email}
              </p>
              <p>
                <b>CPF:</b> {getCpf(submission.user.cpf)}
              </p>
              <p>
                <b>Curso:</b> {submission.user.course}
              </p>
              <p>
                <b>Matrícula:</b> {submission.user?.enrollment}
              </p>
            </Info>
          )}

          <Info>
            <H6>Atividade</H6>

            <p>
              <b>Descrição:</b> {submission.description}
            </p>
            <p>
              <b>Grupo de atividade:</b> {submission.activity.activityGroup.name}
            </p>
            <p>
              <b>Tipo de atividade:</b> {submission.activity.name}
            </p>
            <p>
              <b>Horas solicitadas:</b> {submission.workload}h
            </p>
          </Info>

          <FileInfo>
            <H6>Arquivo(s)</H6>

            <a href={submission.fileUrl} target="_blank" rel="noopener noreferrer">
              <i className="bi bi-filetype-pdf" />

              <div>
                <p>{getFilename(submission.fileUrl)}</p>
                <p>
                  <span>{fileSize}</span>
                </p>

                <i className="bi bi-box-arrow-up-right" />
              </div>
            </a>
          </FileInfo>
        </div>

        <UserActions
          submission={submission}
          user={user}
          onChange={onChange}
        />
      </CollapseDetailsStyled>
    );
  }

  function SubmissionStatus({ status }) {
    const statusBars = {
      1: {
        text: "Submetido",
        bars: ["g", "w", "w"],
      },
      2: {
        text: "Pré-aprovado",
        bars: ["g", "g", "w"],
      },
      3: {
        text: "Aprovado",
        bars: ["g", "g", "g"],
      },
      4: {
        text: "Rejeitado",
        bars: ["g", "r", "r"],
      },
      5: {
        text: "Cancelado",
        bars: ["r", "w", "w"],
      },
    };

    return (
      <SubmissionStatusStyled>
        <p>{statusBars[status].text}</p>

        <div>
          {statusBars[status].bars.map((bar, index) => (
            <ColoredBar key={index} color={bar} />
          ))}
        </div>
      </SubmissionStatusStyled>
    );
  }

  const activityGroupsIcons = {
    ens: "person-video3",
    pes: "search",
    ext: "lightbulb",
  };

  return header ? (
    <Item header={true}>
      <CustomFormCheck
        id="check-all"
        inline
        name="submissions"
        value={"all"}
        label={""}
        onClick={(e) => handleCheck(e)}
      />
      {user?.userTypeId === 3
        ? <Column color={"var(--muted)"}>Descrição</Column>
        : <Column color={"var(--muted)"}>Aluno</Column>
      }
      <Column color={"var(--muted)"}>Grupo de atividade</Column>
      <Column color={"var(--muted)"}>Tipo de atividade</Column>
      <Column color={"var(--muted)"}>Horas solicitadas</Column>
      <Column color={"var(--muted)"}>Status</Column>
      <div></div>
    </Item>
  ) : loading ? (
    <Item>
      <div></div>
      <Column className={"placeholder-wave"}>
        <span className={"placeholder col-md-8 col-12"}></span>
      </Column>
      <Column className={"placeholder-wave"}>
        <span className={"placeholder col-md-8 col-12"}></span>
      </Column>
      <Column className={"placeholder-wave"}>
        <span className={"placeholder col-md-8 col-12"}></span>
      </Column>
      <Column className={"placeholder-wave"}>
        <span className={"placeholder col-md-8 col-12"}></span>
      </Column>
      <Column className={"placeholder-wave"}>
        <span className={"placeholder col-md-8 col-12"}></span>
      </Column>
      <div></div>
    </Item>
  ) : (
    <ItemWrapper>
      <Item
        onClick={() => setCollapsed(!collapsed)}
        aria-expanded={collapsed}
        collapsed={collapsed}>
        <CustomFormCheck
          inline
          name="submissions"
          value={submission?.id.toString()}
          label={
            <CheckboxPreventClick
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            />
          }
          onClick={(e) => handleCheck(e)}
        />

        {user?.userTypeId == 3
          ? <Column>
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip>{submission?.description}</Tooltip>}>
              <span>{submission?.description}</span>
            </OverlayTrigger>
          </Column>
          : <Column>
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip>{submission?.user?.name}</Tooltip>}>
              <>{submission?.user?.name}</>
            </OverlayTrigger>
          </Column>
        }

        <Column>
          <i
            className={`bi bi-${activityGroupsIcons[submission?.activity.activityGroup.name.toLowerCase().slice(0, 3)]}`}
          />
          {submission?.activity.activityGroup.name}
        </Column>

        <Column>
          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip>{submission?.activity.name}</Tooltip>}>
            <span>{submission?.activity.name}</span>
          </OverlayTrigger>
        </Column>

        <Column>{submission?.workload}h</Column>

        <Column>
          <SubmissionStatus status={submission?.status} />
        </Column>

        <i className={`text-center bi bi-${collapsed ? "chevron-up" : "chevron-down"}`} />
      </Item>
      <Collapse in={collapsed}>
        <div>
          <CollapseDetails submission={submission} user={user} onChange={onChange} />
        </div>
      </Collapse>
    </ItemWrapper>
  );
}