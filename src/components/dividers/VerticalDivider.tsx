import React from "react";

interface VerticalDividerProps {
  height: string;
  color: string;
}

const VerticalDivider: React.FC<VerticalDividerProps> = ({ height, color }) => {
  return <div style={{ width: "1px", height, background: color }} />;
};

export default VerticalDivider;