import { styled } from "../../styles";

export const GridProjects = styled('div', {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gridTemplateRows: 'repeat(3, 1fr)',
    gap: '1.5rem',
    height: '100%',
});