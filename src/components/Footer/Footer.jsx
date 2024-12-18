import React from "react";
import { ContainerFooter} from "./styles";
import { Logo } from "../Logo/Logo";

export function Footer(){
    return(
        <ContainerFooter>
            <Logo fill="#FFFFFF" width="32" height="50"/>
        </ContainerFooter>
    )
}