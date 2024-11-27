import {classNames} from '@/lib/functions';
import ImageContainer from '@/components/Images/ImageContainer';

interface IconProps {
  src: string;
  alt: string;
  className: string;
  size: keyof typeof sizeClasses;
}

const sizeClasses = {
  sm: 'h-[15px] w-[15px]',
  md: 'h-[20px] w-[20px]',
  lg: 'h-[25px] w-[25px]',
};

const Icon = ({src, alt, className, size}: IconProps) => (
  <ImageContainer
    image={{original: src, alt}}
    priority
    className={classNames(sizeClasses[size], className)}
  />
);

Icon.defaultProps = {
  alt: 'image icon',
  className: '',
  size: 'md',
};

export default Icon;
