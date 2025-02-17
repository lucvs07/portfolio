import React from "react";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";
import { MainContainer } from "../Home/styles";
import BoxContent from "../../components/BoxContent/BoxContent";
import Box from "../../components/Box/Box";
import { GridSocial } from "./styles";


function Social() {
  return (
    <>
      <Header/>
      <MainContainer>
        <BoxContent title='Social' description='Connect with me on social media for my latest work and ideas.'>
          <GridSocial>
            <Box
              title='LinkedIn'
              description='Professional Network'
              icon='linkedin'
              social={true}
              link='https://www.linkedin.com/in/lucasrgrecco/'
            />
            <Box
              title='GitHub'
              description='Storage my Projects'
              icon='github'
              social={true}
              link='https://github.com/lucvs07'
            />
            <Box
              title='HackerRank'
              description='Practice coding'
              icon='code'
              social={true}
              link='https://www.hackerrank.com/profile/lucas_rgrecco'
            />
            <Box
              title='Behance'
              description='About the desing behind my projects'
              icon='behance'
              social={true}
              link= 'https://www.behance.net/lucasgrecco1'
            />
          </GridSocial>
        </BoxContent>
      </MainContainer>
      <Footer/>
    </>
  );
}

export default Social;
