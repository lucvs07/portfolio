import React from "react";
import {HeaderCard, TitleCard, DescriptionCard} from "../MainCard/styles";
import { CaretCircleLeft } from "@phosphor-icons/react";
import { ContainerPage } from "./styles";
import { Link } from "react-router-dom";
import { styled } from "@stitches/react";

const HoverIcon = styled(CaretCircleLeft, {
    transition: 'all 0.3s ease-in-out',
    borderRadius: '50%',
    "&:hover": {
        transform: 'scale(1.02)',
        boxShadow: '0px 0px 15px 0px #FF9E1F, 0px 0px 8px 0px #FF9E1F, 0px 0px 2px 0px #FF9E1F, 0px 0px 1px 0px #FF9E1F',
        transition: 'all 0.3s ease-in-out',
    },
})

export default function BoxContent({ title, description, children}) {
    return(
        <ContainerPage>
            <HeaderCard>
                <TitleCard>{title}</TitleCard>
                <Link to="/">
                    <HoverIcon size={48} color="#ffa737" weight="fill" />
                </Link>
            </HeaderCard>
            <DescriptionCard>{description}</DescriptionCard>
            {children}
        </ContainerPage> 
    );
}