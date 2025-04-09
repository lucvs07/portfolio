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
    fontSize: 16,
    fontFamily: '$chillax',
    fontWeight: '400',
    textTransform: 'capitalize',
    lineHeight: 1.5,
    letterSpacing: 0.32,
});

export const FlexIcons = styled('div', {
    display: 'flex',
    gap: '1rem',
    flexDirection: 'row',
});