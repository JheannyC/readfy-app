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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="size-4"
            >
              <path
                fillRule="evenodd"
                d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"
                clipRule="evenodd"
              />
            </svg>
          </svg>
        </button>
      ))}
      <span className="ml-2 text-sm text-gray-700">{rating}/5</span>
    </div>
  );
}
