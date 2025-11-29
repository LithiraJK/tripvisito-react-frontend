
import { useState, useEffect, useRef } from 'react';

interface ComboBoxOption {
  value: string;
  label: string;
  icon?: string;
}

interface ComboBoxProps {
  options: ComboBoxOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
  error?: string;
}

const ComboBox = ({
  options,
  value = '',
  onChange,
  placeholder = 'Select an option...',
  label,
  disabled = false,
  className = '',
  error
}: ComboBoxProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<ComboBoxOption[]>(options);
  const [selectedLabel, setSelectedLabel] = useState('');
  const comboBoxRef = useRef<HTMLDivElement>(null);

  // Update filtered options when search term or options change
  useEffect(() => {
    const filtered = options.filter(option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOptions(filtered);
  }, [searchTerm, options]);

  // Update selected label when value changes
  useEffect(() => {
    const selected = options.find(option => option.value === value);
    setSelectedLabel(selected ? selected.label : '');
  }, [value, options]);

  // Handle clicks outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (comboBoxRef.current && !comboBoxRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: ComboBoxOption) => {
    onChange?.(option.value);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={`combobox-container ${className}`} ref={comboBoxRef}>
      {label && (
        <label className="combobox-label block text-sm font-medium mb-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        <div
          className={`combobox-input flex items-center justify-between px-3 py-2 border rounded-md cursor-pointer bg-white ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          } ${error ? 'border-red-500' : 'border-gray-300'} ${
            isOpen ? 'ring-2 ring-blue-500' : ''
          }`}
          onClick={handleToggle}
        >
          <div className="flex items-center gap-2">
            {selectedLabel && value && (
              <>
                {(() => {
                  const selected = options.find(opt => opt.value === value);
                  return selected?.icon ? (
                    <img src={selected.icon} alt="" className="w-5 h-4 object-cover rounded" />
                  ) : null;
                })()}
              </>
            )}
            <span className={selectedLabel ? 'text-gray-900' : 'text-gray-400'}>
              {selectedLabel || placeholder}
            </span>
          </div>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${
              isOpen ? 'transform rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden">
            <div className="p-2 border-b">
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            
            <div className="overflow-y-auto max-h-48">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`px-3 py-2 cursor-pointer hover:bg-blue-50 flex items-center gap-2 ${
                      option.value === value ? 'bg-blue-100 text-blue-700' : ''
                    }`}
                    onClick={() => handleSelect(option)}
                  >
                    {option.icon && (
                      <img src={option.icon} alt="" className="w-5 h-4 object-cover rounded" />
                    )}
                    <span>{option.label}</span>
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-gray-500 text-center">
                  No options found
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default ComboBox;