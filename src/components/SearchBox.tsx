import React, { useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import './SearchBox.css';

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ value, onChange }) => {
  const [open, setOpen] = useState(value !== '');
  // El texto vive acá y no solo en la URL: la URL se actualiza en una transición
  // y, si el input dependiera de ella, se perderían letras al escribir rápido.
  const [text, setText] = useState(value);
  const [prevValue, setPrevValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  // Si la búsqueda se borra desde afuera (ej: al ir a otra sección), vaciamos el input.
  if (value !== prevValue) {
    setPrevValue(value);
    if (value === '') setText('');
  }

  const handleChange = (next: string) => {
    setText(next);
    onChange(next);
  };

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const close = () => {
    handleChange('');
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
            value={text}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Escape' && close()}
            onBlur={() => text === '' && setOpen(false)}
            aria-label="Buscar títulos"
          />
          {text && (
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
