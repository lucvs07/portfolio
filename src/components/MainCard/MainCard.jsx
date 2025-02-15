import React from "react";
import { Student, Desktop, Toolbox, Users, CaretCircleRight} from "@phosphor-icons/react";
import { ContainerCard, HeaderCard, TitleCard, DescriptionCard } from "./styles";
const iconMap = {
    study : <Student size={160} color="#ffa737" weight="fill" />,
    projects: <Desktop size={160} color="#ffa737" weight="fill" />,
    skills: <Toolbox size={160} color="#ffa737" weight="fill" />,
    social: <Users size={160} color="#ffa737" weight="fill" />
}

export function MainCard({title, description, icon, onMouseEnter, onMouseLeave}) {
    return (
        <ContainerCard onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            <HeaderCard>
                <TitleCard>{title}</TitleCard>
                <CaretCircleRight size={48} color="#ffa737" weight="fill" />
            </HeaderCard>
            <DescriptionCard>{description}</DescriptionCard>
            {iconMap[icon]}
        </ContainerCard>
    )
}