import { styled } from "../../styles";

export const GridStudy = styled('div', {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '3.5rem',
    height: '100%',
});


export const ContainerBox = styled('div', {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    alignItems: 'center',
    padding: '0.625rem',
});