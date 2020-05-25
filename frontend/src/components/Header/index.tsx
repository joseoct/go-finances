import React from 'react';

import { Link, useRouteMatch } from 'react-router-dom';

import { Container, MinhaDiv } from './styles';

import Logo from '../../assets/logo.svg';

interface MeuLinkProps {
  activeOnlyWhenExact?: boolean;
  label: string;
  to: string;
}
interface HeaderProps {
  size?: 'small' | 'large';
}

const MeuLink: React.FC<MeuLinkProps> = ({
  activeOnlyWhenExact,
  label,
  to,
}: MeuLinkProps) => {
  const match = useRouteMatch({
    path: to,
    exact: activeOnlyWhenExact,
  });

  return (
    <MinhaDiv className={match ? 'active' : ''}>
      <Link to={to}>{label}</Link>
    </MinhaDiv>
  );
};

const Header: React.FC<HeaderProps> = ({ size = 'large' }: HeaderProps) => {
  return (
    <Container size={size}>
      <header>
        <img src={Logo} alt="GoFinances" />
        <nav>
          <MeuLink activeOnlyWhenExact to="/" label="Listagem" />
          <MeuLink to="/import" label="Importar" />
        </nav>
      </header>
    </Container>
  );
};

export default Header;
