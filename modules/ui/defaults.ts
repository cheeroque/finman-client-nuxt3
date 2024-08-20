import type { UiModuleOptions } from './types'

export const defaults: UiModuleOptions = {
  grid: {
    breakpoints: {
      xs: 0,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
      xxl: 1400,
    },

    containerWidths: {
      xs: null,
      sm: 540,
      md: 720,
      lg: 960,
      xl: 1140,
      xxl: 1320,
    },

    gap: '1.5rem',
  },

  theme: {
    colors: {
      primary: '#6750a4',
      secondary: '#4875b4',
      tertiary: '#c94e32',
      neutral: '#605d62',
      'neutral-variant': '#605d66',
      danger: '#b3261e',
      success: '#31ac3d',
    },
  },

  utilities: {
    d: {
      property: 'display',
      responsive: true,
      values: ['block', 'inline', 'inline-block', 'flex', 'inline-flex', 'grid', 'inline-grid', 'none'],
    },

    fs: {
      property: 'font-size',
      responsive: true,
      values: getRemSizes(),
    },

    fw: {
      property: 'font-weight',
      responsive: true,
      values: [{ light: 300 }, { normal: 400 }, { medium: 500 }, { bold: 800 }],
    },

    gc: {
      property: 'column-gap',
      responsive: true,
      values: getRemSizes(),
    },

    gr: {
      property: 'row-gap',
      responsive: true,
      values: getRemSizes(),
    },

    h: {
      property: 'height',
      responsive: true,
      values: getPercentSizes(),
    },

    lh: {
      property: 'line-height',
      responsive: true,
      values: [{ base: 1.5 }, { heading: 1.2 }, { '100': 1 }, { '120': 1.2 }, { '140': 1.4 }],
    },

    mb: {
      property: 'margin-bottom',
      responsive: true,
      values: getRemSizes(true),
    },

    me: {
      property: 'margin-right',
      responsive: true,
      values: getRemSizes(true),
    },

    ms: {
      property: 'margin-left',
      responsive: true,
      values: getRemSizes(true),
    },

    mt: {
      property: 'margin-top',
      responsive: true,
      values: getRemSizes(true),
    },

    mx: {
      property: ['margin-left', 'margin-right'],
      responsive: true,
      values: getRemSizes(true),
    },

    my: {
      property: ['margin-bottom', 'margin-top'],
      responsive: true,
      values: getRemSizes(true),
    },

    of: {
      property: 'overflow',
      values: ['auto', 'hidden', 'scroll', 'visible'],
    },

    pb: {
      property: 'padding-bottom',
      responsive: true,
      values: getRemSizes(),
    },

    pe: {
      property: 'padding-right',
      responsive: true,
      values: getRemSizes(),
    },

    ps: {
      property: 'padding-left',
      responsive: true,
      values: getRemSizes(),
    },

    pt: {
      property: 'padding-top',
      responsive: true,
      values: getRemSizes(),
    },

    px: {
      property: ['padding-left', 'padding-right'],
      responsive: true,
      values: getRemSizes(),
    },

    py: {
      property: ['padding-bottom', 'padding-top'],
      responsive: true,
      values: getRemSizes(),
    },

    shadow: {
      property: 'box-shadow',
      values: [
        { '1': '0px 1px 3px rgba(0, 0, 0, 0.2), 0px 2px 2px rgba(0, 0, 0, 0.12), 0px 0px 2px rgba(0, 0, 0, 0.14)' },
        { '2': '0px 1px 5px rgba(0, 0, 0, 0.2), 0px 3px 4px rgba(0, 0, 0, 0.12), 0px 0px 4px rgba(0, 0, 0, 0.14)' },
        { '3': '0px 1px 8px rgba(0, 0, 0, 0.2), 0px 3px 4px rgba(0, 0, 0, 0.12), 0px 3px 3px rgba(0, 0, 0, 0.14)' },
        { '4': '0px 1px 10px rgba(0, 0, 0, 0.2), 0px 4px 5px rgba(0, 0, 0, 0.12), 0px 2px 4px rgba(0, 0, 0, 0.14)' },
        { '6': '0px 3px 5px rgba(0, 0, 0, 0.2), 0px 1px 18px rgba(0, 0, 0, 0.12), 0px 6px 10px rgba(0, 0, 0, 0.14)' },
        { '8': '0px 4px 15px rgba(0, 0, 0, 0.2), 0px 3px 14px rgba(0, 0, 0, 0.12), 0px 8px 10px rgba(0, 0, 0, 0.14)' },
        { '9': '0px 5px 6px rgba(0, 0, 0, 0.2), 0px 3px 16px rgba(0, 0, 0, 0.12), 0px 9px 12px rgba(0, 0, 0, 0.14)' },
        { '12': '0px 7px 8px rgba(0, 0, 0, 0.2), 0px 5px 22px rgba(0, 0, 0, 0.12), 0px 12px 17px rgba(0, 0, 0, 0.14)' },
        {
          '16': '0px 8px 10px rgba(0, 0, 0, 0.2), 0px 6px 30px rgba(0, 0, 0, 0.12), 0px 16px 24px rgba(0, 0, 0, 0.14)',
        },
        {
          '24': '0px 11px 15px rgba(0, 0, 0, 0.2), 0px 9px 46px rgba(0, 0, 0, 0.12), 0px 24px 38px rgba(0, 0, 0, 0.14)',
        },
      ],
    },

    ta: {
      property: 'text-align',
      responsive: true,
      values: ['center', 'end', 'start'],
    },

    w: {
      property: 'width',
      responsive: true,
      values: getPercentSizes(),
    },
  },
}

/* Generate relative percent-based sizes (for width & height) */
export function getPercentSizes() {
  return [{ '0': '0', '25': '25%', '50': '50%', '75': '75%', '100': '100%', auto: 'auto' }]
}

/* Generate absolute rem-based sizes (for margins, paddings, font-sizes, etc.) */
export function getRemSizes(withAuto?: boolean) {
  const sizes: Record<string, string>[] = []

  let i = 0

  while (i <= 96) {
    if (i) {
      sizes.push({ [String(i)]: `${i / 16}rem` })
    } else {
      sizes.push({ '0': '0' })
    }

    if (i < 24) i += 2
    else i += 4
  }

  if (withAuto) {
    sizes.push({ auto: 'auto' })
  }

  return sizes
}
