module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      transform: {
        'rotate-y-180': 'rotateY(180deg)',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.backface-hidden': {
          'backface-visibility': 'hidden',
        },
        '.transform-style-3d': {
          'transform-style': 'preserve-3d',
        },
      };
      addUtilities(newUtilities, ['responsive', 'hover']);
    }
  ],
}
