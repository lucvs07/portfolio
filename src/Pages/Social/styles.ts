import { styled } from "../../styles";

export const GridSocial = styled('div', {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gridTemplateRows: 'repeat(2, 1fr)',
    gap: '3.5rem',
    height: '100%',
});