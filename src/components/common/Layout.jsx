import React from 'react';
import styled from 'styled-components';
import { colors, layout } from '../../styles/theme';

const MockupContainer = styled.div`
  width: ${layout.mobileWidth};
  height: ${layout.mobileHeight};
  max-width: 100%;
  max-height: 100dvh;
  margin: 0 auto;
  background-color: ${colors.white};
  border-radius: ${layout.screenRadius};
  box-shadow: 0 0 24px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`;

function Layout({ children, style }) {
  return <MockupContainer style={style}>{children}</MockupContainer>;
}

export default Layout;
