
import { useBreadcrumb } from "contexts/BreadcrumbContext";
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
        <a><i className="bi bi-house-door-fill" /></a>
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
