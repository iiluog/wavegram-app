import React, { useState, useEffect, useRef } from 'react';
import { usersApi } from '@/services/apiSWR';
import { debounce } from 'lodash';
import { getProfileImage } from '@/utils/imageUtils';

const TagInput = ({ value, onChange, onSubmit, postId }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Debounced search function
  const debouncedSearch = useRef(
    debounce(async (query) => {
      if (query.length >= 2) {
        setIsLoading(true);
        try {
          const results = await usersApi.searchUsers(query);
          setSuggestions(results.users);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Failed to fetch suggestions:', error);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300)
  ).current;

  useEffect(() => {
    // Cleanup debounce on unmount
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  useEffect(() => {
    // Handle clicks outside of suggestions
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) &&
          inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    onChange(e);
    debouncedSearch(newValue);
  };

  const handleSuggestionClick = async (user) => {
    try {
      await onSubmit(user.id);
      onChange({ target: { value: '' } });
      setShowSuggestions(false);
      inputRef.current?.focus();
    } catch (error) {
      console.error('Failed to add tag:', error);
    }
  };

  return (
    <div className="relative w-full">
      <div className="flex w-full items-center px-4 border-2 border-secondary rounded-full">
        <input 
          ref={inputRef}
          type="text" 
          placeholder="Aggiungi un username..." 
          className="flex-1 bg-transparent text-primary wg-txt-body focus:outline-none pt-2 leading-none"
          value={value}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onSubmit();
            }
          }}
          enterKeyHint="send"
        />
        <button 
          className="wg-txt-primary text-secondary font-semibold pb-1 leading-none"
          onClick={onSubmit}
        >
          +
        </button>
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && (value.length >= 2) && (
        <div 
          ref={suggestionsRef}
          className="absolute left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-background border border-border rounded-md shadow-lg z-50"
        >
          {isLoading ? (
            <div className="p-2 text-center text-muted-foreground">
              Ricerca...
            </div>
          ) : suggestions.length > 0 ? (
            suggestions.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-2 px-4 py-2 hover:bg-accent cursor-pointer"
                onClick={() => handleSuggestionClick(user)}
              >
                <img
                  src={getProfileImage(user.profile_image)}
                  alt={user.username}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-sm text-primary uppercase">{user.username}</span>
              </div>
            ))
          ) : (
            <div className="p-2 text-center text-muted-foreground">
              Nessun risultato
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TagInput; 