import { styled } from "../../styles";

export const HeaderContent = styled('div', {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
});

export const Line = styled('div', {
    display: 'flex',
    width: '100%',
    height: '0.5rem',
    backgroundColor: '$orange05',
    borderRadius: '0.5rem',
});

export const Subtitle = styled('h3', {
    color: '$snow',
    fontSize: 32,
    fontFamily: '$chillax',
    fontWeight: '600',
    textTransform: 'capitalize',
    letterSpacing: 0.80,
    wordWrap: 'break-word',
    transition: 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out', // Smoother transition
    opacity: 1,
    '&.changing': {
        opacity: 0, // Fade out during the change
        transform: 'translateY(-15px)', // Slight upward movement
    },
});