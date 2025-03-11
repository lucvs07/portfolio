import { styled } from "@stitches/react";

export const Icon = styled('div', {
    display: 'flex',
    padding: '0.625rem 1rem',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '1rem',
    backgroundColor: '$orange10',
    transition: 'all 0.3s ease-in-out',
    "&:hover": {
        cursor: 'pointer',
        transform: 'scale(1.02)',
        boxShadow: '0px 0px 15px 0px #0f0f0e, 0px 0px 8px 0px #201F1D, 0px 0px 2px 0px #201F1D, 0px 0px 1px 0px #201F1D',
        transition: 'all 0.3s ease-in-out',
    },
})
export const Link = styled('a', {
    display: 'flex',
    height : '100%',
});
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
    wordWrap: 'break-word',
    variants: {
        social: {
            true: {
                fontSize: 36,
                fontWeight: '600',
            },
        },
    },
});

export const TextP = styled('p', {
    color: '$snow',
    fontSize: 20,
    fontFamily: '$chillax',
    fontWeight: '300',
    wordWrap: 'break-word',
    variants: {
        social:{
            true : {
                // Professional Networking
                fontSize: 24, fontWeight: '400'
            }
        }
    }
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
    variants: {
        social: {
            true: {
                height: '80%',
            },
        },
    },
});

export const LinkBox = styled('div', {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    height: '100%',
})

export const Modal = styled('dialog', {
    position: "fixed",         
    top: "50%",                
    left: "50%",               
    transform: "translate(-50%, -50%)",
    borderRadius: '1rem',
    border: 'none',
    outline: 'none',
    backgroundColor: '#353431',
    padding: '1rem',
    transition: 'all 0.3s ease-in-out',
    minWidth: '40%',
    "&:hover": {
        boxShadow: '0px 0px 15px 0px #FF9E1F, 0px 0px 8px 0px #FF9E1F, 0px 0px 2px 0px #FF9E1F, 0px 0px 1px 0px #FF9E1F',
        scale: '1.05',
    },
    "&::backdrop": {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    "&:focus":{
        outline: 'none !important',
    }
})

export const ModalContainer = styled('div', {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
})

export const HeadModal = styled('div', {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
});

export const H2Modal = styled('h2', {
    color: '$snow',
    fontSize: '2.5rem',
    fontFamily: '$chillax',
    fontWeight: '600',
    textTransform: 'capitalize',
    wordWrap: 'break-word',
})

export const H3Modal = styled('h3', {
    color: '$snow',
    fontSize: '1.5rem',
    fontFamily: '$chillax',
    fontWeight: '500',
    textTransform: 'capitalize',
    wordWrap: 'break-word',
});

export const PModal = styled('p', {
    color: '$snow',
    fontSize: '1rem',
    fontFamily: '$chillax',
    fontWeight: '300',
    wordWrap: 'break-word',
})
