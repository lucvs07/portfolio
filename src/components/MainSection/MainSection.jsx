import React from "react";
import { MainCard } from "../MainCard/MainCard";
import { Container } from "./styles";
export function MainSection() {
    return (
        <Container>
            {MainCard("Projects", "Explore my projects, where ideas come to life through code.", "projects")}
            {MainCard("Skills", "Discover the skills that drive my work.", "skills")}
            {MainCard("Study", "Education is a journey. Here's where I sharpen my skills and stay current.", "study")}
            {MainCard("Social", "Connect with me on social media for my latest work and ideas.", "social")}
        </Container>
    );
}