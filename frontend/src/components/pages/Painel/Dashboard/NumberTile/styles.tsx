import styled from "styled-components";
import { TileWrapper, CallToAction } from "../Tile/styles";

export const IconWrapper = styled.div`
  width: 40px;
  height: 40px;
  
  display: flex;
  align-items: center;
  justify-content: center;

  margin-left: -5px;
  margin-top: -5px;
  margin-bottom: 15px;
  
  border-radius: 50%;

  & > div.bg {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    opacity: 0.1;
  }

  & > i {
    position: absolute;
    font-size: 1.25rem;
    opacity: 1;
  }
`;

export const Title = styled.h6`
  margin-top: 10px !important;
  font-size: 1.125rem;
  color: var(--muted);
`;

export const Number = styled.p`
  margin: 0 !important;

  line-height: 2rem;
  font-weight: bold;
  font-size: 2rem;
  color: ${({ accent }) => accent} !important;
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
`;

export const CustomTileWrapper = styled(TileWrapper) <{ accent?: string }>`
  /*  position: relative;
  &:after {
    position: absolute;
    left: -1px;
    bottom: -1px;
    height: 10px;
    width: calc(100% + 2px);
    border-radius: 0 0 5px 5px;

    display: block;
    background-color: ${({ accent }) => accent};
    content: "";
  }*/

  ${IconWrapper} {
    & > div.bg {
      background-color: ${({ accent }) => accent};
    }

    & > i {
      color: ${({ accent }) => accent};
    }
  }

  ${Number} {
    color: ${({ accent }) => accent};
  }

  ${CallToAction} {
    color: ${({ accent }) => accent};

    &:hover {
      border-color: ${({ accent }) => accent};
    }
  }
`;