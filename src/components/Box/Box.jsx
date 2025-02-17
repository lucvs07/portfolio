import React from "react";
import { BoxBox,TextContainer,TextH4, TextP ,Icon, Line2, Link} from "./styles";
import { GraduationCap, Medal, LinkedinLogo, GithubLogo, Code, BehanceLogo } from "@phosphor-icons/react";

const iconMap = {
    study : <GraduationCap size={36} color="#353431" weight="regular" />,
    award : <Medal size={36} color="#353431" weight="regular" />,
    linkedin : <LinkedinLogo size={36} color="#353431" weight="regular" />,
    github : <GithubLogo size={36} color="#353431" weight="regular" />,
    code : <Code size={36} color="#353431" weight="regular" />,
    behance : <BehanceLogo size={36} color="#353431" weight="regular" />
}
export default function Box({ title, description, icon, social,link ,children}) {
    return (
        <BoxBox social={social}>
            <Line2></Line2>
            <TextContainer>
                <TextH4 social={social}>{title}</TextH4>
                <TextP social={social}>{description}</TextP>
            </TextContainer>
            {link? (
                <Link href={link} target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none'}}>
                    <Icon>{iconMap[icon]}</Icon> 
                </Link>
            ) : (
                <Icon>{iconMap[icon]}</Icon>
            )
            }
            {children}
        </BoxBox>
    );
}