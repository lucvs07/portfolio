import React from "react";
import {ContainerHeader, Title} from './styles.ts'
import {Logo} from '../Logo/Logo'

export function Header(){
    return (
        <ContainerHeader>
            <Logo /> 
            <Title>PORTFOLIO</Title>
        </ContainerHeader>
    )
}