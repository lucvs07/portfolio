import { styled } from "../../styles";
export const ContainerPage = styled('div', {
    display: 'flex',
    padding: '24px',
    flexDirection: 'column',
    gap: '2rem',
    borderRadius: '24px',
    border: '1px solid rgba(32, 31, 29, 0.20)',
    backgroundColor: 'rgba(32, 31, 29, 0.46)',
    backdropFilter: 'blur(10px)',
    gridArea: '1 / 1 / -1 / -1',
    height: '90%',
});