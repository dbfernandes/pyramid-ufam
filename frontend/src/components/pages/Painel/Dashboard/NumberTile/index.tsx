import {
  CustomTileWrapper,
  IconWrapper,
  Number,
  Title
} from "./styles";
import { CallToAction } from "../Tile/styles";
import Link from "next/link";
import Spinner from "components/shared/Spinner";

interface INumberTileProps {
  icon?: string;
  accent?: string;
  title?: string;
  value?: string;
  callToAction?: string;
  callToActionIcon?: string;
  link?: string;
  fetching?: boolean;
  onClick?: () => void;
}

export default function NumberTile({
  icon,
  accent = "var(--primary-color)",
  title,
  value,
  callToAction,
  callToActionIcon,
  link,
  fetching,
  onClick = () => { }
}: INumberTileProps) {
  return (
    <CustomTileWrapper accent={accent}>
      <div>
        <IconWrapper>
          <div className="bg" />

          {fetching ? (
            <Spinner size={"20px"} color={"var(--primary-color)"} />
          ) : (
            <i className={`bi bi-${icon}`} />
          )}
        </IconWrapper>

        <Number accent={accent}>
          {fetching ? <div className="placeholder-glow"><span className={"placeholder col-6"} /></div> : value}
        </Number>
        <Title>
          {fetching ? <div className="placeholder-glow"><span className={"placeholder col-12"} /></div> : title}
        </Title>
      </div>

      {callToAction && (
        link ? (
          <Link href={link}>
            <a>
              <CallToAction>
                <i className={`bi bi-box-arrow-up-right`} />
                {callToAction}
              </CallToAction>
            </a>
          </Link>
        ) : (
          <CallToAction onClick={onClick}>
            {callToActionIcon && <i className={`bi bi-${callToActionIcon}`} />}
            {callToAction}
          </CallToAction>
        )
      )}

      {fetching && (
        <CallToAction onClick={() => { }}>
          <Spinner size={"20px"} color={"var(--primary-color)"} />
        </CallToAction>
      )}
    </CustomTileWrapper>
  );
}
