import { createStitches } from '@stitches/react'

export const {
    config,
    styled,
    css,
    globalCss,
    keyframes,
    getCssText,
    theme,
    createTheme,
} = createStitches({
    theme: {
        colors: {
            snow: '#FFFBFC',
            orange05: '#FFAF47',
            orange10: '#FFAF47',
            orange15: '#FF9E1F',
            black05: '#353431',
            black10: '#252422',
            black15: '#201F1D',
        },
        fonts: {
            chillax: 'Chillax, sans-serif',
        },
    },
})