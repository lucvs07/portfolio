import { styled } from '../../styles';
export const ContainerCard = styled('div', {
    display: 'flex',
    padding: '24px',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderRadius: '24px',
    border: '1px solid rgba(32, 31, 29, 0.20)',
    backgroundColor: 'rgba(32, 31, 29, 0.46)',
    backdropFilter: 'blur(10px)',
    width: '100%',
    height: '90%',
    transition: 'all 0.3s ease-in-out',
    "&:hover": {
        transform: 'scale(1.02)',
        boxShadow: '0px 0px 15px 0px #FF9E1F, 0px 0px 8px 0px #FF9E1F, 0px 0px 2px 0px #FF9E1F, 0px 0px 1px 0px #FF9E1F',
        transition: 'all 0.3s ease-in-out',
    },
});

export const HeaderCard = styled('div', {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
});

export const TitleCard = styled('h2', {
    color: '$snow',
    fontFamily: '$chillax',
    fontSize: '3rem',
    fontStyle: 'normal',
    fontWeight: 700,
    lineHeight: '1',
    textTransform: 'capitalize',
    letterSpacing: '0.1rem',
});

export const DescriptionCard = styled('p', {
    color: '$snow',
    fontFamily: '$chillax',
    fontSize: '1.5rem',
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: '36px',
    textTransform: 'capitalize',
    letterSpacing: '0.48px',
    width: '100%',
});