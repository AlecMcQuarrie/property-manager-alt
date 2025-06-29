import React from 'react';
import { themeClasses } from '@/lib/theme';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  header, 
  footer 
}) => {
  return (
    <div className={`${themeClasses.card} ${className}`}>
      {header && (
        <div className={themeClasses.cardHeader}>
          {header}
        </div>
      )}
      <div className={themeClasses.cardContent}>
        {children}
      </div>
      {footer && (
        <div className={themeClasses.cardHeader}>
          {footer}
        </div>
      )}
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <div className={`${themeClasses.cardHeader} ${className}`}>
    {children}
  </div>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <div className={`${themeClasses.cardContent} ${className}`}>
    {children}
  </div>
); 