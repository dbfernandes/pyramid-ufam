import Link from 'next/link';

// Shared
import { H2 } from 'components/shared/Titles';
import Wrapper from 'components/shared/Wrapper';

export default function Custom404() {
  return (
    <Wrapper centerAlign={true} style={{ minHeight: "75vh" }}>
      <H2>404 - Página não encontrada</H2>
      <Link href="/">Voltar para a página inicial</Link>
    </Wrapper>
  );
}