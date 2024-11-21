import React from 'react';
import { customStyles } from '@/styles/appTheme';

const PostDescription = ({ description }) => {
  return (
    <div>
      <p className="wg-txt-body px-4">
        {description}
      </p>
    </div>
  );
};

export default PostDescription; 