import React, { useState } from 'react';

function StarRating({ totalStars = 5, initialRating = 0, onRate, size = 24, editable = true }) {
    const [rating, setRating] = useState(initialRating);
    const [hover, setHover] = useState(0);

    const handleClick = (rate) => {
        if (!editable) return;
        setRating(rate);
        if (onRate) {
            onRate(rate);
        }
    };

    return (
        <div>
            {[...Array(totalStars)].map((star, index) => {
                const ratingValue = index + 1;
                return (
                    <span
                        key={index}
                        style={{
                            cursor: editable ? 'pointer' : 'default',
                            fontSize: `${size}px`,
                            color: ratingValue <= (hover || rating) ? '#ffc107' : '#e4e5e9'
                        }}
                        onMouseEnter={() => editable && setHover(ratingValue)}
                        onMouseLeave={() => editable && setHover(0)}
                        onClick={() => handleClick(ratingValue)}
                    >
                        ★
                    </span>
                );
            })}
        </div>
    );
}

export default StarRating;