import React from "react";
import { MainCard } from "../MainCard/MainCard";
import { Container} from "./styles";
export const MainSection = ({setAnimation}) => {
    const handleMouseEnter = (animation) => {
        setAnimation(animation);
    };
    return (
        <Container>
            <MainCard
                onMouseEnter={() => handleMouseEnter("Stretching")}
                onMouseLeave={() => handleMouseEnter("Standing")}
                title="Projects"
                description="Explore my projects, where ideas come to life through code."
                icon="projects"
            />
            <MainCard
                onMouseEnter={() => handleMouseEnter("Rock")}
                onMouseLeave={() => handleMouseEnter("Standing")}
                title="Skills"
                description="Discover the skills that drive my work."
                icon="skills"
            />
            <MainCard
                onMouseEnter={() => handleMouseEnter("Waving")}
                onMouseLeave={() => handleMouseEnter("Standing")}
                title="Study"
                description="Education is a journey. Here's where I sharpen my skills and stay current."
                icon="study"
            />
            <MainCard
                onMouseEnter={() => handleMouseEnter("Salute")}
                onMouseLeave={() => handleMouseEnter("Standing")}
                title="Social"
                description="Connect with me on social media for my latest work and ideas."
                icon="social"
            />
        </Container>
    );
}