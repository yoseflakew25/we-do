const withMT = require('@material-tailwind/react/utils/withMT');

module.exports = withMT({
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans'],
        epilogue: ['Epilogue', 'sans'],
        cursive: ['Cedarville Cursive', 'cursive'],
      },
      fontWeight: {
        thin: '100',
        extraLight: '200',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extraBold: '800',
        black: '900',
      },
      container: {
        center: true,
      },
      colors: {
        white: '#ffffff',
        grey: '#e1e4f0',
        black: '#000000',
        lightGrey: '#D6DDEB',
        neutrals100: '#25324B',
        neutrals80: '#515b6f',
        neutrals60: '#7C8493',
        neutral20: '#F6F6F7',
        moto: '#202430',

        primary: '#C4897B',
        lighterPrimary: '#C4897B',
        secondary: '#EDDCD7',
        tertiary: '#F8F8FD',
        wine25: '#C9C9EE',
        redAccent: '#FF6550',
        green: '#0FB957',
        lightGreen: '#e8f8ef',
        yellowAccent: '#FFB836',
        greenAccent: '#56CDAD',
        organization: '#C4897B',
        opportunity: '#B35ED4',
        volunteer: '#3474DF',
        pricing: '#DCB8B0',
        chip: '#F1F1FF',
        blue: '#3F51B5',
        table: '#F8F8FC',
      },
      textColor: {
        black: 'black',
        white: 'white',
        grey: 'grey',
        blue: 'blue',

        lightGrey: '#D6DDEB',
        neutral20: '#F6F6F7',
        neutrals60: '#7C8493',
        neutrals80: '#515b6f',
        neutrals100: '#25324B',
        moto: '#202430',

        primary: '#C4897B',
        lighterPrimary: '#C4897B',
        secondary: '#474750',
        tertiary: '#7c8493',
        wine25: '#C9C9EE',
        bgPrimary: '#C4897B',
        redAccent: '#FF6550',
        green: '#0FB957',
        lightGreen: '#e8f8ef',
        yellowAccent: '#FFB836',
        greenAccent: '#56CDAD',
        blueAccent: '#26A4FF',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        expandContract2: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.5' },
          '20%, 80%': { transform: 'scale(4)', opacity: '0.25' },
        },
        expandContract3: {
          '0%, 20%': { transform: 'scale(1)', opacity: '0.25' },
          '40%, 60%': { transform: 'scale(6)', opacity: '0.1' },
          '80%': { transform: 'scale(4)', opacity: '0.1' },
          '100%': { transform: 'scale(1)', opacity: '0.25' },
        },
        expandContract4: {
          '0%, 40%': { transform: 'scale(1)', opacity: '0.1' },
          '80%': { transform: 'scale(8)', opacity: '0.05' },
          '100%': { transform: 'scale(1)', opacity: '0.1' },
        },
        moveCircle1: {
          '0%, 100%': {
            top: '-80%',
            left: '-40%',
          },
          '25%': {
            top: '-30%',
            left: '40%',
          },
          '50%': {
            top: '-40%',
            left: '-30%',
          },
          '75%': {
            top: '-80%',
            left: '30%',
          },
        },
        moveCircle2: {
          '0%, 100%': {
            top: '-30%',
            left: '30%',
          },
          '25%': {
            top: '-80%',
            left: '-30%',
          },
          '50%': {
            top: '-80%',
            left: '30%',
          },
          '75%': {
            top: '-30%',
            left: '-30%',
          },
        },
        meteor: {
          '0%': { transform: 'rotate(215deg) translateX(0)', opacity: '1' },
          '70%': { opacity: '1' },
          '100%': {
            transform: 'rotate(215deg) translateX(-500px)',
            opacity: '0',
          },
        },
        'loop-scroll': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-100%)' },
        },
        typing: {
          '0%': {
            width: '0%',
            visibility: 'hidden',
          },
          '100%': {
            width: '60%',
          },
        },
        blink: {
          '50%': {
            borderColor: 'transparent',
          },
          '100%': {
            borderColor: 'white',
          },
        },
        pulseTwo: {
          '0%, 100%': {
            opacity: '.9',
            transform: 'scale(1)',
          },
          '50%': {
            opacity: '1',
            transform: 'scale(1.1)',
          },
        },
        'bounce-custom': {
          '0%, 60%, 100%': { transform: 'translateY(0)' },
          '30%': { transform: 'translateY(-4px)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'expand-contract-2': 'expandContract2 5s infinite',
        'expand-contract-3': 'expandContract3 5s infinite',
        'expand-contract-4': 'expandContract4 5s infinite',
        'move-circle-1': 'moveCircle1 16s ease-in-out infinite',
        'move-circle-2': 'moveCircle2 16s ease-in-out infinite',
        'meteor-effect': 'meteor 5s linear infinite',
        typing: 'typing 2s steps(15) infinite alternate, blink .7s infinite',
        'loop-scroll': 'loop-scroll 50s linear infinite',
        'bounce-slow': 'bounce-custom 1.3s linear infinite',
        'pulse-two': 'pulseTwo 3s infinite',
      },
      backgroundImage: {
        'moving-gradient':
          'linear-gradient(135deg, #DDDCF2, rgba(252, 105, 220, 0.5))',
      },
      backgroundSize: {
        '200': '200% 200%',
      },

      gradientColorStops: {
        // you can add your own gradients here like this
        // 'blue-amber': {
        //   '0': '#3490dc',
        //   '50': '#6574cd',
        //   '100': '#8b5cf6',
        // },
      },

      boxShadow: {
        'service-tile':
          '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },

      textStyles: {
        title: {
          fontSize: '6rem', // Adjust the size as needed
          color: '#25324B',
          textAlign: 'center',
          fontFamily: 'Poppins',
          // fontSize: '32px',
          fontStyle: 'normal',
          fontWeight: '900',
          lineHeight: '120%' /* 38.4px */,
        },
        subtitle: {
          fontWeight: 'semibold',
          fontSize: '1.25rem', // Adjust the size as needed
          color: '#ddd', // Adjust the color as needed
        },
      },
    },
  },
  plugins: [
    [require('tailwindcss-animate')],
    require('@tailwindcss/typography'),
  ],
});
