import React from 'react';
import {classNames} from '@/lib/functions';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card = ({children, className}: CardProps) => (
  <div className={`card ${className ? className : ''}`}>{children}</div>
);

export default Card;
