import { styled } from '../../styles';
export const ContainerHeader = styled('header', {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    gap: '1rem',
    backgroundColor: '$black10',
    boxShadow: '0px 0px 6531.84px 0px rgba(255, 175, 71, 0.25), 0px 0px 3732.48px 0px rgba(255, 175, 71, 0.25), 0px 0px 2177.28px 0px rgba(255, 175, 71, 0.25), 0px 0px 1088.64px 0px rgba(255, 175, 71, 0.25), 0px 0px 311.04px 0px rgba(255, 175, 71, 0.25), 0px 0px 155.52px 0px rgba(255, 175, 71, 0.25)',
    zIndex: 100,
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    '@sm': {
        padding: '1rem 2rem',
    },
    borderRadius: '0 0 1rem 1rem',
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