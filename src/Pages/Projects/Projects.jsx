import React from "react";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";
import { MainContainer } from "../Home/styles";
import BoxContent from "../../components/BoxContent/BoxContent";
import Box from "../../components/Box/Box";
import { GridProjects } from "./styles";


function Projects() {
  return (
    <>
      <Header/>
      <MainContainer>
        <BoxContent title='Projects' description='Explore my projects, where ideas come to life through code.'>
          <GridProjects>
            <Box
              title='DeereGO'
              description='System for IoT-Based Logistics Optimization in Manufacturing'
              icon='github'
              social={true}
              project={true}
              link='https://github.com/An4lu/DeereGO'
            />
            <Box
              title='DeereGo - ESP32'
              description='IoT Solution to Locate and Monitor Assets'
              icon='github'
              social={true}
              project={true}
              link= 'https://github.com/lucvs07/deereGO-ESP'
            />
            <Box
              title='CARI'
              description='System for Sustainable Food Organization and Consumption'
              icon='github'
              social={true}
              project={true}
              link='https://github.com/lucvs07/CARI'
            />
            <Box
              title='Hungerdle'
              description='Web Game to guess the character from Hunger Games'
              icon='github'
              social={true}
              project={true}
              link='https://github.com/lucvs07/Api-Hunger'
            />
            <Box
              title='Pokédex'
              description='Web App to search for Pokémon information'
              icon='github'
              social={true}
              project={true}
              link= 'https://github.com/lucvs07/pokedex'
            />
            <Box
              title='One Way'
              description='Web System for a Clothing Store'
              icon='github'
              social={true}
              project={true}
              link= 'https://github.com/lucvs07/OneWay'
            />
            
          </GridProjects>
        </BoxContent>
      </MainContainer>
      <Footer/>
    </>
  );
}

export default Projects;
