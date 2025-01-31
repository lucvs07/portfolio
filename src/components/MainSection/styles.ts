import { styled } from "../../styles";
export const Container = styled("div", {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(300px, 1fr))',
    gap: '24px',
    padding: '24px',
});

