import {Router} from 'next/router';
import {useEffect, useState} from 'react';
import {Colors} from '@/lib/enums/Colors';

const stopDelayMs = 200;

const GlobalLoader = ({message}: any) => {
  let timer: NodeJS.Timeout | null = null;

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    Router.events.on('routeChangeStart', routeChangeStart);
    Router.events.on('routeChangeComplete', routeChangeEnd);
    Router.events.on('routeChangeError', routeChangeError);
    return () => {
      Router.events.off('routeChangeStart', routeChangeStart);
      Router.events.off('routeChangeComplete', routeChangeEnd);
      Router.events.off('routeChangeError', routeChangeError);
    };
  }, []);

  const routeChangeStart = () => {
    setIsLoading(true);
  };

  const routeChangeEnd = () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      setIsLoading(false);
    }, stopDelayMs);
  };

  const routeChangeError = (_err: Error, _url: string) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      setIsLoading(false);
    }, stopDelayMs);
  };

  if (!isLoading) return null;

  return (
    <div className="loader">
      <svg
        width="152"
        height="122"
        viewBox="0 0 332 267"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="path1"
          d="M163.088 17.0124C173.199 5.61992 185.355 -0.409069 199.754 0.0215729C220.447 0.68711 235.711 11.2574 243.736 31.615C251.447 51.268 248.772 70.2945 235.121 85.9934C212.697 111.754 189.407 136.731 166.472 162.021C166.196 162.334 165.882 162.569 165.37 163C164.78 162.491 164.151 162.06 163.639 161.512C141.491 138.806 119.46 115.982 97.2326 93.3926C88.1056 84.1142 81.6538 73.4656 79.5687 59.9591C75.438 33.1419 94.3214 5.50247 119.539 1.66584C135.629 -0.800562 149.634 3.74075 161.515 15.6421C161.948 16.0728 162.42 16.4251 163.049 16.9732L163.088 17.0124Z"
          fill={Colors.PRINCIPAL_COLOR}
        />
        <path
          className="path2"
          d="M316.605 171.796C320.491 178.191 324.808 183.802 327.634 190.197C337.289 212.248 330.421 239.008 312.053 253.133C293.174 267.65 267.191 266.041 250.511 249.013C227.119 225.118 203.923 200.987 180.648 176.975C180.177 176.465 179.706 175.915 179 175.091C181.551 172.227 183.985 169.402 186.496 166.616C204.786 146.331 223.076 126.085 241.366 105.839C244.035 102.896 246.664 99.8752 249.53 97.1287C263.659 83.6313 280.026 79.5508 297.923 85.9855C316.291 92.5772 327.281 106.781 330.303 127.341C332.776 144.016 328.105 158.573 317.351 170.932C316.959 171.403 316.566 171.835 316.605 171.796Z"
          fill={Colors.WHITE}
        />
        <path
          className="path3"
          d="M16.0523 177.376C8.98501 170.312 4.15572 162.11 1.68218 152.377C-3.93237 130.086 4.82318 106.578 23.2373 94.5695C41.7692 82.5213 65.6409 84.9545 81.5422 101.163C104.982 125.024 128.147 149.159 151.43 173.216C151.901 173.727 152.333 174.276 153 175.022C148.328 180.202 143.773 185.265 139.18 190.327C121.983 209.4 104.707 228.395 87.6279 247.546C79.0294 257.201 69.2137 264.068 56.6105 266.345C31.2469 270.936 5.13728 250.843 1.56439 223.528C-0.673576 206.339 3.68457 191.426 14.8351 178.789C15.1492 178.397 15.4633 178.004 15.9737 177.337L16.0523 177.376Z"
          fill={Colors.DARK_COLOR}
        />
      </svg>
      <p>{message}</p>
    </div>
  );
};

export default GlobalLoader;
