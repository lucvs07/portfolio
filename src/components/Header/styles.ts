import { styled } from '../../styles';
export const ContainerHeader = styled('header', {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    gap: '1rem',
    backgroundColor: '$black10',
    boxShadow: '0px 1px 4px 0px $black15',
    zIndex: 100,
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    '@sm': {
        padding: '1rem 2rem',
    },
});


export const Title = styled('h1', {
    color: '$snow',
    fontFamily: '$chillax',
    fontSize: '3.5rem',
    fontStyle: 'normal',
    fontWeight: 700,
    lineHeight: '1',
    textTransform: 'uppercase',
});