import styled, { css } from 'styled-components';

interface ContainerProps {
  size?: 'small' | 'large';
}

export const Container = styled.div<ContainerProps>`
  background: #5636d3;
  padding: 30px 0;

  header {
    width: 1120px;
    margin: 0 auto;
    padding: ${({ size }) => (size === 'small' ? '0 20px ' : '0 20px 150px')};
    display: flex;
    align-items: center;
    justify-content: space-between;

    nav {
      display: flex;
      position: relative;

      div {
        & + div {
          margin-left: 36px;
        }
      }
    }
  }
`;

export const MinhaDiv = styled.div`
  a {
    color: #ccc;
    text-decoration: none;
    font-size: 16px;
    transition: opacity 0.2s;
    position: relative;

    &:hover {
      opacity: 0.6;
    }

    ${props =>
      props.className &&
      css`
        color: #fff;

        &::after {
          content: '';
          width: 73px;
          height: 2px;
          background-color: #ff872c;
          position: absolute;
          left: 0;
          top: 27px;
        }
      `}
  }
`;
