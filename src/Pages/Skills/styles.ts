import { styled } from "../../styles";

export const GridSkills = styled('div', {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '3.5rem',
    height: '100%',
});
export const ContainerBox = styled('div', {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
});

export const SkillsP = styled('p', {
    color: '$snow',
    fontSize: '1.2rem',
    fontFamily: '$chillax',
    fontWeight: '400',
    textTransform: 'capitalize',
    lineHeight: 1.5,
    letterSpacing: 0.32,
    transition: 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out', // Smoother transition
    opacity: 1,
    '&.changing': {
        opacity: 0, // Fade out during the change
        transform: 'translateY(-15px)', // Slight upward movement
    },
});

export const FlexIcons = styled('div', {
    display: 'flex',
    gap: '1rem',
    flexDirection: 'row',
});

export const ProjectBoxContainer = styled('div', {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    opacity: 0,
    transform: 'translateY(15px)',
    transition: 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out',
    '&.visible': {
        opacity: 1,
        transform: 'translateY(0)',
    },
});