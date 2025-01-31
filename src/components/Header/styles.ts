import { styled } from '../../styles';
export const ContainerHeader = styled('header', {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    gap: '1rem',
    backgroundColor: '$black10',
    boxShadow: `
        0px 0px 300px 0px rgba(255, 175, 71, 0.15), 
        0px 0px 200px 0px rgba(255, 175, 71, 0.15), 
        0px 0px 100px 0px rgba(255, 175, 71, 0.15), 
        0px 0px 50px 0px rgba(255, 175, 71, 0.10), 
        0px 0px 20px 0px rgba(255, 175, 71, 0.10), 
        0px 0px 10px 0px rgba(255, 175, 71, 0.10)
    `,
    zIndex: 100,
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    '@sm': {
        padding: '1rem 2rem',
    },
    borderRadius: '0 0 1rem 1rem',
    width: '100%',
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