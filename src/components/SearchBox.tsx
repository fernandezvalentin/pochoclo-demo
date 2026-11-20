import React, { useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import './SearchBox.css';

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ value, onChange }) => {
  const [open, setOpen] = useState(value !== '');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const close = () => {
    onChange('');
    setOpen(false);
  };

  return (
    <div className={`search ${open ? 'search--open' : ''}`}>
      <button
        className="search__icon"
        onClick={() => (open ? inputRef.current?.focus() : setOpen(true))}
        aria-label="Buscar"
      >
        <Search size={22} />
      </button>
      {open && (
        <>
          <input
            ref={inputRef}
            className="search__input"
            type="search"
            placeholder="Títulos, géneros..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Escape' && close()}
            onBlur={() => value === '' && setOpen(false)}
            aria-label="Buscar títulos"
          />
          {value && (
            <button className="search__clear" onMouseDown={(e) => e.preventDefault()} onClick={close} aria-label="Borrar búsqueda">
              <X size={18} />
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default SearchBox;
