// nastaveni grafu
export const moznostiGrafu = {
  maintainAspectRatio: false,
  elements: {
    point: {
      radius: 0,
    },
  },
  scales: {
    y: {
      ticks: {
        stepSize: 500,
        font: {
          size: 18,
        },
        beginAtZero: true,
        color: 'black',
      },
      min: -1,
      max: 1,
      title: {
        display: true,
        text: 's(t)',
        font: {
          size: 22,
          style: 'italic',
        },
        color: 'black',
      },
    },
    x: {
      title: {
        display: true,
        text: 't',
        font: {
          size: 22,
          style: 'italic',
        },
        color: 'black',
      },
      ticks: {
        autoskip: true,
        autoSkipPadding: 190,
        color: 'black',
        font: {
          size: 18,
        },
      },
    },
  },
  animation: {
    duration: 0,
  },
}
