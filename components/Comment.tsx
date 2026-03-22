"use client";

import { useEffect, useState } from "react";
import { ApiFetch } from "@/lib/ApiFetch";

interface Review {
  id: number;
  user: any;
  rating: number;
  comment: string;
  created_at: string;
  images?: { id: number; image: string }[];
}

export default function Comment({ productId }: { productId: number }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");

  const [images, setImages] = useState<File[]>([]);
  const [inputKey, setInputKey] = useState(Date.now());

  const [loading, setLoading] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await ApiFetch(`/api/products/get/review/${productId}/`);
      const data = await res.json();

      if (Array.isArray(data)) {
        const sorted = data.sort((a: Review, b: Review) => {
          const aHas = a.images?.length ? 1 : 0;
          const bHas = b.images?.length ? 1 : 0;
          return bHas - aHas;
        });

        setReviews(sorted);
      } else {
        setReviews([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    setImages((prev) => [...prev, ...selectedFiles]);
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!rating) return alert("Please select a rating");

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("rating", String(rating));
      formData.append("comment", comment);

      images.forEach((img) => {
        formData.append("images", img);
      });

      await ApiFetch(`/api/products/add/review/${productId}/`, {
        method: "POST",
        body: formData,
      });

      setRating(0);
      setComment("");
      setImages([]);
      setInputKey(Date.now());

      fetchReviews();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reviewId: number) => {
    try {
      await ApiFetch(`/api/products/delete/review/${reviewId}/`, {
        method: "DELETE",
      });
      fetchReviews();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-16">

      {/* ================= ADD REVIEW ================= */}
      <div className="w-full max-w-5xl mx-auto bg-white p-6 md:p-10 rounded-3xl shadow-md border border-gray-100 mb-14">

        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800">
          ✍️ Write a Review
        </h2>

        {/* ⭐ STARS */}
        <div className="flex gap-2 md:gap-3 text-3xl md:text-4xl mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setRating(star)}
              className={`cursor-pointer transition duration-200 ${
                star <= rating
                  ? "text-yellow-400 scale-110"
                  : "text-gray-300 hover:text-yellow-300"
              }`}
            >
              ★
            </span>
          ))}
        </div>

        {/* TEXTAREA */}
        <textarea
          placeholder="Share your experience with this product..."
          className="w-full border border-gray-200 rounded-2xl p-4 md:p-5 text-sm md:text-base focus:ring-2 focus:ring-blue-500 outline-none mb-6 transition"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        {/* 📸 FILE INPUT (CUSTOM) */}
        <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-2xl p-6 cursor-pointer hover:border-blue-400 transition mb-6 bg-gray-50">
          <span className="text-sm md:text-base text-gray-500 mb-2">
            📸 Upload Review Images
          </span>
          <span className="text-xs text-gray-400">
            Click to upload multiple images
          </span>
          <input
            key={inputKey}
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>

        {/* PREVIEW */}
        {images.length > 0 && (
          <div className="flex gap-3 flex-wrap mb-6">
            {images.map((img, i) => (
              <div key={i} className="relative group">
                <img
                  src={URL.createObjectURL(img)}
                  className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-xl border"
                />
                <button
                  onClick={() => removeImage(i)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full opacity-90 hover:scale-110 transition"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* BUTTON */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-3 rounded-xl shadow-md hover:scale-105 hover:shadow-lg transition duration-200"
        >
          {loading ? "Posting..." : "🚀 Submit Review"}
        </button>

      </div>

      {/* ================= REVIEWS ================= */}
      <div className="w-full max-w-5xl mx-auto">

        {reviews.length === 0 && (
          <div className="w-full h-[260px] flex flex-col items-center justify-center bg-white rounded-3xl border shadow-sm">
            <p className="text-xl font-semibold text-gray-500 mb-2">
              No Reviews Yet
            </p>
            <p className="text-sm text-gray-400">
              Be the first to share your experience ✨
            </p>
          </div>
        )}

        <div className="flex flex-col gap-8">

          {reviews.map((review) => (
            <div
              key={review.id}
              className="w-full bg-white p-6 md:p-7 rounded-3xl shadow-sm border hover:shadow-md transition"
            >

              {/* TOP */}
              <div className="flex items-center justify-between mb-4">

                <div className="flex items-center gap-3 md:gap-4">

                  <img
                    src={
                      review.user?.avatar ||
                      "https://ui-avatars.com/api/?name=" +
                        (review.user?.name || "User")
                    }
                    className="w-11 h-11 md:w-12 md:h-12 rounded-full object-cover border"
                  />

                  <div>
                    <p className="text-sm md:text-base font-semibold text-gray-800">
                      {review.user?.name || "User"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>

                </div>

                <button
                  onClick={() => handleDelete(review.id)}
                  className="text-xs md:text-sm bg-red-50 text-red-500 px-3 py-1 rounded-lg hover:bg-red-100 transition"
                >
                  Delete
                </button>

              </div>

              {/* ⭐ STARS */}
              <div className="text-yellow-400 text-lg mb-2">
                {"★".repeat(review.rating)}
                {"☆".repeat(5 - review.rating)}
              </div>

              {/* COMMENT */}
              <p className="text-sm md:text-base text-gray-700 mb-4 leading-relaxed">
                {review.comment}
              </p>

              {/* IMAGES */}
              {review.images && review.images.length > 0 && (
                <div className="flex gap-3 flex-wrap">
                  {review.images.map((img) => (
                    <img
                      key={img.id}
                      src={img.image}
                      className="w-24 h-24 md:w-28 md:h-28 object-cover rounded-xl border hover:scale-105 transition"
                    />
                  ))}
                </div>
              )}

            </div>
          ))}

        </div>
      </div>
    </div>
  );
}