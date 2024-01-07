
const isDesktop = () => window.innerWidth > 991;
const isTablet = () => window.innerWidth > 768 && window.innerWidth > 991;
const isMobile = () => window.innerWidth < 480;
export { isDesktop, isTablet, isMobile };
