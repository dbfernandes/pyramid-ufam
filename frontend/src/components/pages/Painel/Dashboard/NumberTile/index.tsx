import {
  CustomTileWrapper,
  IconWrapper,
  Number,
  Title
} from "./styles";
import { CallToAction } from "../Tile/styles";
import Link from "next/link";

// Interfaces
interface INumberTileProps {
  icon?: string;
  accent?: string;
  title: string;
  value: string;

  callToAction?: string;
  callToActionIcon?: string;
  link?: string;
  onClick?: Function;
}

export default function NumberTile({
  icon,
  accent = "var(--primary-color)",
  title,
  value,

  callToAction,
  callToActionIcon,
  link,
  onClick = () => { }
}: INumberTileProps) {
  return (
    <CustomTileWrapper accent={accent}>
      <div>
        <IconWrapper>
          <div className="bg" />
          <i className={`bi bi-${icon}`} />
        </IconWrapper>

        <Number>{value}</Number>
        <Title>{title}</Title>
      </div>

      {callToAction
        ? link
          ? <Link href={link}>
            <a>
              <CallToAction>
                <i className={`bi bi-box-arrow-up-right`} />
                {callToAction}
              </CallToAction>
            </a>
          </Link>
          : <CallToAction onClick={onClick}>
            {callToActionIcon && <i className={`bi bi-${callToActionIcon}`} />}
            {callToAction}
          </CallToAction>
        : null
      }
    </CustomTileWrapper>
  );
}