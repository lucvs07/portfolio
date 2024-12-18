import React from "react";
import {ContainerHeader, Logo, Title} from './styles.ts'

export function Header(){
    return (
        <ContainerHeader>
            <Logo src="/public/logo.svg"></Logo>
            <Title>PORTFOLIO</Title>
        </ContainerHeader>
    )
}