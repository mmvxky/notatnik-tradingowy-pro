import React, { useState, useEffect, useRef } from 'react';

function CustomSelect({ options, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  const handleOptionClick = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  // Efekt do zamykania menu po kliknięciu na zewnątrz
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  return (
    <div className="custom-select-wrapper" ref={wrapperRef}>
      <button 
        type="button" 
        className="glass-input custom-select-trigger" 
        onClick={() => setIsOpen(!isOpen)}
      >
        {value}
        <span className="arrow"></span>
      </button>
      {isOpen && (
        <ul className="custom-select-options">
          {options.map(option => (
            <li 
              key={option.value} 
              className="custom-select-option"
              onClick={() => handleOptionClick(option.value)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CustomSelect;