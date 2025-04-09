import React from "react";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";
import { MainContainer } from "../Home/styles";
import { GridSkills, ContainerBox, SkillsP, FlexIcons} from "./styles";
import { Icon } from "../../components/Box/styles";
import TitleContent from "../../components/TitleContent/TitleContent";
import BoxContent from "../../components/BoxContent/BoxContent";
import { FaCss3Alt, FaPhp, FaPython, FaReact } from "react-icons/fa";
import { RiFileExcel2Fill, RiJavascriptFill, RiTailwindCssFill } from "react-icons/ri";
import { DiNodejs } from "react-icons/di";
import { CgFigma } from "react-icons/cg";
import { TbSql } from "react-icons/tb";
import { SiMonero, SiMongodb, SiPandas } from "react-icons/si";


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
                <FlexIcons >
                    <Icon style={{ fontSize: "4rem" }}>
                      <FaPhp />
                    </Icon>
                    <Icon style={{ fontSize: "4rem" }}>
                      <RiJavascriptFill />
                    </Icon>
                    <Icon style={{ fontSize: "4rem" }}>
                      <FaReact />
                    </Icon>
                    <Icon style={{ fontSize: "4rem" }}>
                      <FaPython />
                    </Icon>
                    <Icon style={{ fontSize: "4rem" }}>
                        <DiNodejs/>
                    </Icon>
                </FlexIcons>
              <TitleContent title={'Data'}/>
                <FlexIcons >
                    <Icon style={{ fontSize: "4rem" }}>
                      <TbSql />
                    </Icon>
                    <Icon style={{ fontSize: "4rem" }}>
                      <RiFileExcel2Fill />
                    </Icon>
                    <Icon style={{ fontSize: "4rem" }}>
                      <SiPandas/>
                    </Icon>
                    <Icon style={{ fontSize: "4rem" }}>
                      <SiMongodb/>
                    </Icon>
                </FlexIcons>
                
              <TitleContent title={'Design'}/>
                <FlexIcons >
                    <Icon style={{ fontSize: "4rem" }}>
                      <CgFigma />
                    </Icon>
                    <Icon style={{ fontSize: "4rem" }}>
                     <RiTailwindCssFill />
                    </Icon>
                    <Icon style={{ fontSize: "4rem" }}>
                     <FaCss3Alt/>
                    </Icon>
                </FlexIcons>
              
            </ContainerBox>
            
          </GridSkills>

        </BoxContent>
      </MainContainer>
      <Footer/>
    </>
  );
}

export default Skills;
