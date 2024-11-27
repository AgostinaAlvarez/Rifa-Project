import {useState, useEffect, useRef} from 'react';

const useClickOutside = (initialState: boolean = false) => {
  const [isFocusComponent, setIsFocusComponent] = useState<boolean>(initialState);
  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: any) => {
    const exist = Boolean(ref.current && ref.current.contains(event.target));
    setIsFocusComponent(exist);
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  return {ref, isFocusComponent, setIsFocusComponent};
};

export default useClickOutside;
