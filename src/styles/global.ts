import { globalCss } from '.'

export const globalStyles = globalCss({
    '*': {
        margin: '0px',
        padding: '0rem',
        boxSizing: 'border-box',
        fontFamily: '$chillax',
        '&::-webkit-scrollbar': {
            width: '5px',
            height: '8px',
        },
        '&::-webkit-scrollbar-track': {
            backgroundColor: '$black10',
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: '$orange10',
            borderRadius: '4px',
        },
    },
    'body, input, textarea, button, select': {
        '&::-webkit-scrollbar': {
            width: '2px',
        },
        '&::-webkit-scrollbar-track': {
            backgroundColor: '$orange10',
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: '$black05',
            borderRadius: '4px',
        },
    },

    body: {
        height: '100vh',
        overflowX: 'hidden',
        overflowY: 'auto',
        backgroundColor: '$black10',
        backgroundImage: 'url("/patern-2.png")',
        backgroundRepeat: 'repeat',
        backgroundSize: '1%',
    },
    img: {
        display: 'block',
        maxWidth: '100%',
    },
    a: {
        textDecoration: 'none',
        color: 'inherit',
    },
    
});