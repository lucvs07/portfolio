import React from "react";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";
import { MainContainer } from "../Home/styles";
import { GridSkills, ContainerBox, SkillsP} from "./styles";
import TitleContent from "../../components/TitleContent/TitleContent";
import BoxContent from "../../components/BoxContent/BoxContent";


function Skills() {
  return (
    <>
      <Header/>
      <MainContainer>
        <BoxContent title={'Skills'} description={'My skills are the result of my experiences and my constant search for knowledge.'}>
          <GridSkills>
            <ContainerBox>
              <TitleContent title={'Select a Skill to Discover'}/>
              <SkillsP>Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim quisquam quasi accusantium, ad optio impedit itaque. Quis ut, molestiae maxime neque explicabo odio fuga minus, voluptatibus laboriosam impedit ipsa vero.</SkillsP>
              <TitleContent title={'Some Projects'}/>
            </ContainerBox>
            
            <ContainerBox>
              <TitleContent title={'Programing'}/>
              <TitleContent title={'Design'}/>
              <TitleContent title={'Data'}/>
            </ContainerBox>
            
          </GridSkills>

        </BoxContent>
      </MainContainer>
      <Footer/>
    </>
  );
}

export default Skills;
