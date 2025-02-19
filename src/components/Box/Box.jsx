import React from "react";
import { BoxBox,TextContainer,TextH4, TextP ,Icon, Line2, Link, LinkBox} from "./styles";
import { GraduationCap, Medal, LinkedinLogo, GithubLogo, Code, BehanceLogo, ArrowsOutSimple } from "@phosphor-icons/react";

const iconMap = {
    study : <GraduationCap size={36} color="#353431" weight="regular" />,
    award : <Medal size={36} color="#353431" weight="regular" />,
    linkedin : <LinkedinLogo size={36} color="#353431" weight="regular" />,
    github : <GithubLogo size={36} color="#353431" weight="regular" />,
    code : <Code size={36} color="#353431" weight="regular" />,
    behance : <BehanceLogo size={36} color="#353431" weight="regular" />,
    out : <ArrowsOutSimple size={36} color="#353431" weight="regular" />
}
export default function Box({ title, description, icon, social,link, project,children}) {
    return (
        <BoxBox social={social}>
            <Line2></Line2>
            <TextContainer>
                <TextH4 social={social}>{title}</TextH4>
                <TextP social={social}>{description}</TextP>
            </TextContainer>
            {link? (
                project ? (
                    <LinkBox>
                        <Link href={link} target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none'}}>
                            <Icon>{iconMap[icon]}</Icon> 
                        </Link>
                        <Link href={link} target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none'}}>
                            <Icon>{iconMap["out"]}</Icon> 
                        </Link>
                    </LinkBox>
                ) : (
                    <Link href={link} target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none'}}>
                        <Icon>{iconMap[icon]}</Icon> 
                    </Link>
            )) : (
                <Icon>{iconMap[icon]}</Icon>
            )
            }
            {children}
        </BoxBox>
    );
}