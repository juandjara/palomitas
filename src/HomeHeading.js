import React from 'react';
import {Flex, Box} from 'rebass'
import Icon from './Icon';
import styled from 'styled-components';
import theme from './theme';

const HeadingStyle = styled.header`
  padding: 8px 16px;
  margin-bottom: 1.5rem;
  h2 {
    margin: 1em;
    text-align: center;
    font-weight: normal;
    font-size: 28px;
    line-height: 1.4;
    text-shadow: ${theme.textShadow};
  }
`;
const HeadingBox = styled(Box)`
  text-align: center;
  padding: 8px 1em;
  line-height: 1.4;
  .material-icons {
    font-size: 46px;
    margin-bottom: .5rem;
  }
`;

const HomeHeading = () => (
  <HeadingStyle>
    <h2>El regreso de Popcorn Time y las series libres.</h2>
    <Flex flexWrap="wrap">
      <HeadingBox
        fontSize={[1, 2]} 
        width={[1/2, 1/4]}>
        <Icon icon="whatshot" />
        <p>Las &uacute;ltimas novedades</p>
      </HeadingBox>
      <HeadingBox
        fontSize={[1, 2]} 
        width={[1/2, 1/4]}>
        <Icon icon="movie" />
        <p>Todas las series en versi&oacute;n original</p>
      </HeadingBox>
      <HeadingBox
        fontSize={[1, 2]} 
        width={[1/2, 1/4]}>
        <Icon icon="language" />
        <p>Subtitulos en todos los idiomas</p>
      </HeadingBox>
      <HeadingBox
        fontSize={[1, 2]} 
        width={[1/2, 1/4]}>
        <Icon icon="cloud" />
        <p>
          Proyecto de codigo abierto.
          {' '} <a href="https://github.com/juandjara/palomitas">
            Haz tus propias palomitas
          </a>
        </p>
      </HeadingBox>
    </Flex>
  </HeadingStyle>
);

export default HomeHeading;
