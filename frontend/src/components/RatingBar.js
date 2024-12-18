// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

import React from 'react';
import { identity } from '../utils/identity.js';
import { protect } from '../utils/protect.js';

const RatingBar = identity(function ({ field }) {
  const starsContainerRef = React.useRef(null);

  React.useEffect(() => {
    let countOfFilledStars = Math.floor(field.value);
    let decimalPart = null;
    if (countOfFilledStars < 0) {
      countOfFilledStars = 0;
      decimalPart = 0;
    }
    else if (countOfFilledStars > 5) {
      countOfFilledStars = 5;
      decimalPart = 0;
    }
    else {
      decimalPart = field.value - countOfFilledStars;
    }
    const stars = starsContainerRef.current.childNodes;
    for (let i = 0; i < countOfFilledStars; i++) {
      stars[i].classList.add('text-' + (protect(field.color, field.value) ?? 'primary'));
    }
    if (countOfFilledStars < 5 && decimalPart > 0) {
      const partialStar = stars[countOfFilledStars];
      partialStar.style.clipPath = `polygon(0 0, ${decimalPart * 100}% 0, ${decimalPart * 100}% 100%, 0% 100%)`;
      partialStar.classList.add('text-' + (protect(field.color, field.value) ?? 'primary'));
    }
  }, [field.value]);

  return (
    <div>
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}></div>
        <div className="text-disabled" style={{ position: 'relative', zIndex: 2 }}>
          <span>★</span>
          <span>★</span>
          <span>★</span>
          <span>★</span>
          <span>★</span>
        </div>
        <div ref={starsContainerRef} className="text-disabled" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 3 }}>
          <span>★</span>
          <span>★</span>
          <span>★</span>
          <span>★</span>
          <span>★</span>
        </div>
      </div>
      <div className="pt-1">
        <div className={'text-' + (protect(field.color, field.value) ?? 'primary')}>{format(field.value, 'decimal', {})}</div>
      </div>
    </div>
  );
});

export default RatingBar;