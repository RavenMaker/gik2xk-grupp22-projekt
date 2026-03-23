import { useState, useEffect } from 'react';

export default function ProductRating({ productId, initialRating, initialCount }) {
    const [rating, setRating] = useState(parseFloat(initialRating) || 0);
    const [count, setCount] = useState(parseInt(initialCount) || 0);
    const [hover, setHover] = useState(0);

    useEffect(() => {
        setRating(parseFloat(initialRating) || 0);
        setCount(parseInt(initialCount) || 0);
    }, [initialRating, initialCount]);

    const saveRating = async (val) => {
        const res = await fetch(`http://localhost:5000/api/products/${productId}/rate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rating: val })
        });
        if (res.ok) {
            // Recalculate average immediately without waiting for a page reload
            setRating(prev => parseFloat(((prev * count + val) / (count + 1)).toFixed(2)));
            setCount(c => c + 1);
            alert("Tack!");
        }
    };

    return (
        <div className="d-flex align-items-center">
            {[1, 2, 3, 4, 5].map((i) => {
                const activeVal = hover || rating;
                let fill = 0;
                if (activeVal >= i) fill = 100;
                else if (activeVal > i - 1) fill = (activeVal - (i - 1)) * 100;

                return (
                    <span
                        key={i}
                        onClick={() => saveRating(i)}
                        onMouseEnter={() => setHover(i)}
                        onMouseLeave={() => setHover(0)}
                        style={{ position: 'relative', cursor: 'pointer', fontSize: '1.2rem', color: '#ccc' }}
                    >
                        <span>★</span>
                        <span style={{
                            position: 'absolute', top: 0, left: 0, width: `${fill}%`,
                            overflow: 'hidden', color: '#ffc107'
                        }}>★</span>
                    </span>
                );
            })}
            <span className="ms-2 small text-muted">({count})</span>
        </div>
    );
}
