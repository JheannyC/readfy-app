"use client";

import { useState, useEffect } from "react";

interface StarRatingProps {
  bookId: number;
  initialRating?: number;
}

export default function StarRating({
  bookId,
  initialRating = 0,
}: StarRatingProps) {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setRating(initialRating);
  }, [initialRating]);

  const handleClick = async (newRating: number) => {
    const previousRating = rating;
    setRating(newRating);
    setSaving(true);

    try {
      const res = await fetch(`/api/book/update/${bookId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avaliacao: newRating }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      const result = await res.json();
      if (result.livro?.avaliacao !== undefined) {
        setRating(result.livro.avaliacao);
      } else {
        console.error("Resposta inválida do backend:", result);
        setRating(previousRating);
      }
    } catch (err) {
      console.error("Erro ao salvar rating:", err);
      setRating(previousRating);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleClick(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="focus:outline-none transition-transform duration-150"
          disabled={saving}
        >
          <svg
            className={`w-6 h-6 cursor-pointer transition-colors duration-150 ${
              star <= (hover || rating) ? "text-yellow-400" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.955c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.286-3.955a1 1 0 00-.364-1.118L2.034 9.382c-.784-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.955z" />
          </svg>
        </button>
      ))}
      <span className="ml-2 text-sm text-gray-700">{rating}/5</span>
    </div>
  );
}
