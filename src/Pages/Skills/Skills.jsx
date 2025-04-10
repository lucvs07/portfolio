import React, { useState } from "react";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";
import { MainContainer } from "../Home/styles";
import { GridSkills, ContainerBox, SkillsP, FlexIcons, ProjectBoxContainer } from "./styles";
import { Icon } from "../../components/Box/styles";
import TitleContent from "../../components/TitleContent/TitleContent";
import BoxContent from "../../components/BoxContent/BoxContent";
import { FaCss3Alt, FaPhp, FaPython, FaReact } from "react-icons/fa";
import { RiFileExcel2Fill, RiJavascriptFill, RiTailwindCssFill } from "react-icons/ri";
import { DiNodejs } from "react-icons/di";
import { CgFigma } from "react-icons/cg";
import { TbSql } from "react-icons/tb";
import { SiMongodb, SiPandas } from "react-icons/si";
import skills from "../../assets/data/skills.json";
import projects from "../../assets/data/projects.json";
import Box from "../../components/Box/Box";

function Skills() {
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [isChanging, setIsChanging] = useState(false);
  const [isProjectChanging, setIsProjectChanging] = useState(false); // New state for project transition

  const handleMouseEnter = (skillName) => {
    setIsChanging(true); // Trigger the text transition
    setIsProjectChanging(true); // Trigger the project transition
    setTimeout(() => {
      const skill = skills.skills.find((s) => s.name === skillName);
      setHoveredSkill(skill);
      setIsChanging(false); // End the text transition
      setIsProjectChanging(false); // End the project transition
    }, 300); // Match the transition duration
  };

  const getDefaultDescription = (category) => {
    switch (category) {
      case "Programing":
        return "Explore my programming skills.";
      case "Data":
        return "Discover my data-related expertise.";
      case "Design":
        return "Check out my design capabilities.";
      default:
        return "Hover over an icon to learn more.";
    }
  };

  const filteredProjects = hoveredSkill
    ? projects.projetos.filter((project) =>
        project.tech.includes(hoveredSkill.name)
      )
    : [];

  const truncateDescription = (description) => {
    const firstDotIndex = description.indexOf(".");
    return firstDotIndex !== -1 ? description.substring(0, firstDotIndex + 1) : description;
  };

  return (
    <>
      <Header />
      <MainContainer>
        <BoxContent 
          title={'Skills'} 
          description={'My skills are the result of my experiences and my constant search for knowledge.'}
        >
          <GridSkills>
            <ContainerBox>
              <TitleContent 
                title={hoveredSkill ? hoveredSkill.name : 'Hover to Discover'} 
                className={isChanging ? 'changing' : ''} 
              />
              <SkillsP className={isChanging ? 'changing' : ''}>
                {hoveredSkill ? hoveredSkill.description : getDefaultDescription()}
              </SkillsP>
              <TitleContent title={'Some Projects'} />
              <ProjectBoxContainer className={isProjectChanging ? '' : 'visible'}>
                {filteredProjects.map((project) => (
                  <Box
                    key={project.id}
                    title={project.nome}
                    description={truncateDescription(project.descricao)}
                    icon="github"
                    link={project.link}
                  />
                ))}
              </ProjectBoxContainer>
            </ContainerBox>

            <ContainerBox>
              <TitleContent title={'Programing'} />
              <FlexIcons>
                <Icon style={{ fontSize: "4rem" }} onMouseEnter={() => handleMouseEnter("PHP")}>
                  <FaPhp />
                </Icon>
                <Icon style={{ fontSize: "4rem" }} onMouseEnter={() => handleMouseEnter("Javascript")}>
                  <RiJavascriptFill />
                </Icon>
                <Icon style={{ fontSize: "4rem" }} onMouseEnter={() => handleMouseEnter("React")}>
                  <FaReact />
                </Icon>
                <Icon style={{ fontSize: "4rem" }} onMouseEnter={() => handleMouseEnter("Python")}>
                  <FaPython />
                </Icon>
                <Icon style={{ fontSize: "4rem" }} onMouseEnter={() => handleMouseEnter("NodeJs")}>
                  <DiNodejs />
                </Icon>
              </FlexIcons>

              <TitleContent title={'Data'} />
              <FlexIcons>
                <Icon style={{ fontSize: "4rem" }} onMouseEnter={() => handleMouseEnter("SQL")}>
                  <TbSql />
                </Icon>
                <Icon style={{ fontSize: "4rem" }} onMouseEnter={() => handleMouseEnter("Excel")}>
                  <RiFileExcel2Fill />
                </Icon>
                <Icon style={{ fontSize: "4rem" }} onMouseEnter={() => handleMouseEnter("Pandas")}>
                  <SiPandas />
                </Icon>
                <Icon style={{ fontSize: "4rem" }} onMouseEnter={() => handleMouseEnter("MongoDB")}>
                  <SiMongodb />
                </Icon>
              </FlexIcons>

              <TitleContent title={'Design'} />
              <FlexIcons>
                <Icon style={{ fontSize: "4rem" }} onMouseEnter={() => handleMouseEnter("Figma")}>
                  <CgFigma />
                </Icon>
                <Icon style={{ fontSize: "4rem" }} onMouseEnter={() => handleMouseEnter("Tailwind")}>
                  <RiTailwindCssFill />
                </Icon>
                <Icon style={{ fontSize: "4rem" }} onMouseEnter={() => handleMouseEnter("CSS")}>
                  <FaCss3Alt />
                </Icon>
              </FlexIcons>
            </ContainerBox>
          </GridSkills>
        </BoxContent>
      </MainContainer>
      <Footer />
    </>
  );
}

export default Skills;
