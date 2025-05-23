import React from "react";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";
import { MainContainer } from "../Home/styles";
import BoxContent from "../../components/BoxContent/BoxContent";
import Box from "../../components/Box/Box";
import TitleContent from "../../components/TitleContent/TitleContent";
import { GridStudy,ContainerBox } from "./styles";



function Study() {
  return (
    <>
      <Header/>
      <MainContainer>
        <BoxContent title="Study" description="Education is a journey. Here’s where I sharpen my skills and stay current.">
          <GridStudy>
            <ContainerBox>
              <TitleContent title="Education"/>
              <Box
                title='FIAP - Computer Engineering'
                description='Bachelor Deegree - 2024 to 2028'
                icon='study'
              />
              <Box
                title='Etec Parque Belém - Informatics'
                description='High School with Technical Course - 2021 to 2023'
                icon='study'
              />
            </ContainerBox>
            
            <ContainerBox>
              <TitleContent title="Honors and Awards"/>
              <Box
                title='Podium Challenge FIAP 2024'
                description='Developed a location system with John Deere'
                icon='award'
              />
              <Box
                title='Exchange Scholarship'
                description='Exchange to Ireland by Academic Achievment'
                icon='award'
              />
            </ContainerBox>
          </GridStudy>
        </BoxContent>
      </MainContainer>
      <Footer/>
    </>
  );
}

export default Study;
