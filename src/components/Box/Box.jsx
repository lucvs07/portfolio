"use client";
import React, { useRef } from "react";
import { BoxBox,TextContainer,TextH4, TextP ,Icon, Line2, Link, LinkBox, Modal, HeadModal, H2Modal, ModalContainer, H3Modal, PModal} from "./styles";
import { GraduationCap, Medal, LinkedinLogo, GithubLogo, Code, BehanceLogo, ArrowsOutSimple, XCircle} from "@phosphor-icons/react";
import { styled } from "@stitches/react";
import projects from "../../assets/data/projects.json";

const iconMap = {
    study : <GraduationCap size={36} color="#353431" weight="regular" />,
    award : <Medal size={36} color="#353431" weight="regular" />,
    linkedin : <LinkedinLogo size={36} color="#353431" weight="regular" />,
    github : <GithubLogo size={36} color="#353431" weight="regular" />,
    code : <Code size={36} color="#353431" weight="regular" />,
    behance : <BehanceLogo size={36} color="#353431" weight="regular" />,
    out : <ArrowsOutSimple size={36} color="#353431" weight="regular" />,
}


const HoverIcon = styled(XCircle, {
    transition: 'all 0.3s ease-in-out',
    backgroundColor: '#FF9E1F',
    borderRadius: '50%',
    "&:hover": {
        transform: 'scale(1.02)',
        boxShadow: '0px 0px 15px 0px #FF9E1F, 0px 0px 8px 0px #FF9E1F, 0px 0px 2px 0px #FF9E1F, 0px 0px 1px 0px #FF9E1F',
        transition: 'all 0.3s ease-in-out',
    },
})

export default function Box({ title, description, icon, social,link, project,children}) {
    const dialogRef = useRef(null);
    const projetos = projects.projetos;
    const projeto = projetos.find(proj => proj.nome === title);

    return (
        <>
            {projeto && (
                <Modal ref={dialogRef}>
                    <ModalContainer>
                        <HeadModal>
                            <H2Modal>{projeto.nome}</H2Modal>
                            <HoverIcon size={48} color="#353431" weight="fill" onClick={() => dialogRef.current?.close()} />
                        </HeadModal>
                        <H3Modal>Tech</H3Modal>
                        <PModal>{projeto.tech.join(' ● ')}</PModal>
                        <PModal>{projeto.descricao}</PModal>
                    </ModalContainer>
                </Modal>
            )}
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
                            <Link style={{textDecoration: 'none'}} onClick={() => dialogRef.current?.showModal()}>
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
        </>
    );
}