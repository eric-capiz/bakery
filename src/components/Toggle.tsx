import { useState, ReactNode } from "react";

interface ToggleProps {
  children: ReactNode;
  title: string;
}

const Toggle = ({ children, title }: ToggleProps) => {
  const [toggle, setToggle] = useState<boolean>(false);

  return (
    <div 
      className={`question ${toggle ? "active" : ""}`} 
      onClick={() => setToggle(!toggle)}
    >
      <h4 className={toggle ? "active" : ""}>
        {title}
      </h4>
      <div className="answer">
        {children}
      </div>
    </div>
  );
};

export default Toggle;
