import React from "react";
import { MainCard } from "../MainCard/MainCard";
import { Container } from "./styles";
export const MainSection = ({setAnimation}) => {
    const handleMouseEnter = (animation) => {
        setAnimation(animation);
    };
    return (
        <Container>
            {MainCard("Projects", "Explore my projects, where ideas come to life through code.", "projects", { onMouseEnter: () => handleMouseEnter("Stretching") })}
            {MainCard("Skills", "Discover the skills that drive my work.", "skills", { onMouseEnter: () => handleMouseEnter("Rock") })}
            {MainCard("Study", "Education is a journey. Here's where I sharpen my skills and stay current.", "study", { onMouseEnter: () => handleMouseEnter("Dance") })}
            {MainCard("Social", "Connect with me on social media for my latest work and ideas.", "social", { onMouseEnter: () => handleMouseEnter("Salute") })}
        </Container>
    );
}