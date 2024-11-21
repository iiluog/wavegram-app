import React from 'react';

const CommentInput = ({ value, onChange, onSubmit }) => {
  return (
    <div className="flex items-center gap-2 m-4 px-4 border-2 border-secondary rounded-full">
      <input 
        type="text" 
        placeholder="Scrivi un commento..." 
        className="flex-1 bg-transparent text-primary wg-txt-body focus:outline-none pt-2 leading-none"
        value={value}
        onChange={onChange}
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
  );
};

export default CommentInput; 