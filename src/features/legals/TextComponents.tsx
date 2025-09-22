import React, { ReactNode } from 'react';

// Component for the main title of the page
export const Title: React.FC<{ children: ReactNode }> = ({ children }) => (
  <h1 className='text-3xl font-bold mb-6'>{children}</h1>
);

// Component for section headers (Header 1)
export const Header1: React.FC<{ children: ReactNode }> = ({ children }) => (
  <h2 className='text-2xl font-semibold mb-4'>{children}</h2>
);

// Component for subsection headers (Header 2)
export const Header2: React.FC<{ children: ReactNode }> = ({ children }) => (
  <h3 className='text-xl font-semibold mb-4'>{children}</h3>
);

// Component for smaller headers (Header 3)
export const Header3: React.FC<{ children: ReactNode }> = ({ children }) => (
  <h4 className='text-lg font-medium mb-2'>{children}</h4>
);

// Component for paragraph text content
export const Content: React.FC<{ children: ReactNode }> = ({ children }) => (
  <p className='text-gray-700 mb-4'>{children}</p>
);

// Component for unordered list content
export const List: React.FC<{ items: string[] }> = ({ items }) => (
  <ul className='list-disc ml-6 text-gray-700 mb-4'>
    {items.map((item, index) => (
      <li key={index}>{item}</li>
    ))}
  </ul>
);
