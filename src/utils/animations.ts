export const transitions = {
  page: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  fast: { duration: 0.2, ease: 'easeOut' },
}

export const variants = {
  page: {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -12 },
  },
  fadeInUp: {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0 },
  },
  tile: {
    hidden: { opacity: 0, scale: 0.96 },
    show: { opacity: 1, scale: 1 },
    hover: { scale: 1.02, boxShadow: '0 0 40px rgba(34,197,94,0.35)' },
    tap: { scale: 0.98 },
  },
  shake: {
    hidden: { x: 0 },
    show: { x: [0, -8, 8, -6, 6, -3, 3, 0] },
  },
}
