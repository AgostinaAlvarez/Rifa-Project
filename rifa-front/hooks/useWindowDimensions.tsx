import {useEffect, useState} from 'react';

const useWindowDimensions = (): {height: number; width: number} => {
  const [windowDimensions, setWindowDimensions] = useState({height: 0, width: 0});
  useEffect(() => {
    const getWindowDimensions = () => {
      const {innerWidth: width, innerHeight: height} = window;
      return {width, height};
    };
    setWindowDimensions(getWindowDimensions());
    window.addEventListener('resize', () => setWindowDimensions(getWindowDimensions()));
  }, []);
  return windowDimensions;
};

export default useWindowDimensions;
