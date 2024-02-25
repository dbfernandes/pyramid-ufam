
import { useBreadcrumb } from "contexts/BreadcrumbContext";
import { HouseDoorFill } from "react-bootstrap-icons";
import Link from "next/link";

// Custom
import { Wrapper } from "./styles";

// Interfaces
interface IBreadcrumbProps {
  isMobile: boolean;
}

export default function Breadcrumb({ isMobile }: IBreadcrumbProps) {
  const { links } = useBreadcrumb();

  return (
    <Wrapper>
      <Link href={"/painel"} passHref>
        <a>
          <HouseDoorFill />
        </a>
      </Link>

      {links.length > 0 &&
        links.map((link, index) => (
          <div key={index}>
            <span> /</span>
            {
              link.route ? (
                <Link href={link.route} passHref>
                  <a>{link.title}</a>
                </Link>
              ) : (
                <p>{link.title}</p>
              )
            }
          </div>
        ))
      }
    </Wrapper >
  );
}
