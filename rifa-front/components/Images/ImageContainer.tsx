import Image from 'next/legacy/image';
import {classNames} from '@/lib/functions';
import {ImageContainerProps} from '@/types/components';

const ImageContainer = ({
  image,
  className,
  imageClassName,
  objectFit,
  loadingType = 'lazy',
  priority,
}: ImageContainerProps) => (
  <div className={classNames('relative', className || '')}>
    {image?.original ? (
      <Image
        src={image.original}
        alt={image.alt}
        className={classNames(
          objectFit || '',
          imageClassName || '',
          'object-contain  lg:object-cover'
        )}
        layout="fill"
        {...(priority ? {priority} : {loading: loadingType, lazyBoundary: '1000px'})}
      />
    ) : null}
  </div>
);

export default ImageContainer;
