const isMobile = () => window.innerWidth < 1000
const isHorizontal = () => window.innerWidth > window.innerHeight
const isSx = () => window.innerWidth < 600
const isSm = () => window.innerWidth >= 600 && window.innerWidth < 900
const isMd = () => window.innerWidth >= 900 && window.innerWidth < 1200
const isLg = () => window.innerWidth >= 1200 && window.innerWidth < 1536
const isXl = () => window.innerWidth >= 1536

export { isHorizontal, isLg, isMd, isMobile, isSm, isSx, isXl }
