import { styled } from "@stitches/react";

export const Icon = styled('div', {
    display: 'flex',
    padding: '0.625rem 1rem',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '1rem',
    backgroundColor: '$orange10',
})
export const Line2 = styled('div', {
    display: 'flex',
    height: '100%',
    width: '0.5rem',
    backgroundColor: '$orange05',
    borderRadius: '0.5rem',
});

export const TextH4 = styled('h4', {
    color: '$snow',
    fontSize: 24,
    fontFamily: '$chillax',
    fontWeight: '500',
    textTransform: 'capitalize',
    wordWrap: 'break-word'
});

export const TextP = styled('p', {
    color: '$snow',
    fontSize: 20,
    fontFamily: '$chillax',
    fontWeight: '300',
    wordWrap: 'break-word'
});

export const TextContainer = styled('div', {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    justifyContent: 'center',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    width: '100%',
});

export const BoxBox = styled('div', {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    gap: '1rem',
    padding: '1.5rem',
    borderRadius: '1rem',
    backgroundColor: '$black05',
    transition: 'all 0.3s ease-in-out',
    "&:hover": {
        transform: 'scale(1.02)',
        boxShadow: '0px 0px 15px 0px #FF9E1F, 0px 0px 8px 0px #FF9E1F, 0px 0px 2px 0px #FF9E1F, 0px 0px 1px 0px #FF9E1F',
        transition: 'all 0.3s ease-in-out',
    },
});