import { styled } from '../../styles';

export const ContainerFooter = styled('footer', {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem 10px',
    gap: '1rem',
    backgroundColor: '$black15',
    zIndex: 100,
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    '@sm': {
        padding: '1rem 2rem',
    },
    borderRadius: '1rem 1rem 0px 0px'
});
