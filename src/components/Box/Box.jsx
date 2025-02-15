import React from "react";
import { BoxBox,TextContainer,TextH4, TextP ,Icon, Line2 } from "./styles";
import { GraduationCap, Medal } from "@phosphor-icons/react";

const iconMap = {
    study : <GraduationCap size={36} color="#353431" weight="regular" />,
    award : <Medal size={36} color="#353431" weight="regular" />
}
export default function Box({ title, description, icon, children}) {
    return (
        <BoxBox>
            <Line2></Line2>
            <TextContainer>
                <TextH4>{title}</TextH4>
                <TextP>{description}</TextP>
            </TextContainer>
            <Icon>{iconMap[icon]}</Icon>
            {children}
        </BoxBox>
    );
}