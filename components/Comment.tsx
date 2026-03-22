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

  // ================= FETCH REVIEWS =================
  const fetchReviews = async () => {
    try {
      const res = await ApiFetch(`/api/products/get/review/${productId}/`);
      const data = await res.json();

      if (Array.isArray(data)) {
        // ✅ reviews with images first
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

  // ================= IMAGE SELECT =================
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);

    // ✅ append instead of replace
    setImages((prev) => [...prev, ...selectedFiles]);

    // ✅ allow reselect same files
    e.target.value = "";
  };

  // ================= REMOVE IMAGE =================
  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // ================= SUBMIT =================
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

      // ✅ RESET
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

  // ================= DELETE =================
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
    <div className="mt-16 w-full px-4 md:px-10 lg:px-20">

      {/* ================= ADD REVIEW ================= */}
      <div className="w-full bg-white p-5 md:p-8 rounded-3xl shadow-sm border mb-12">

        <h2 className="text-xl md:text-2xl font-semibold mb-6">
          Write a Review
        </h2>

        {/* ⭐ STARS */}
        <div className="flex gap-3 text-3xl md:text-4xl mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setRating(star)}
              className={`cursor-pointer transition ${
                star <= rating
                  ? "text-yellow-400 scale-110"
                  : "text-gray-300"
              }`}
            >
              ★
            </span>
          ))}
        </div>

        {/* TEXTAREA */}
        <textarea
          placeholder="Share your experience with this product..."
          className="w-full border rounded-2xl p-4 text-sm md:text-base focus:ring-2 focus:ring-black outline-none mb-6"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        {/* 📸 FILE INPUT */}
        <input
          key={inputKey}
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="mb-4"
        />

        {/* 📸 PREVIEW */}
        {images.length > 0 && (
          <div className="flex gap-3 flex-wrap mb-6">
            {images.map((img, i) => (
              <div key={i} className="relative">

                <img
                  src={URL.createObjectURL(img)}
                  className="w-20 h-20 object-cover rounded-lg"
                />

                {/* ❌ REMOVE */}
                <button
                  onClick={() => removeImage(i)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full"
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
          className="w-full md:w-auto bg-blue-700 text-white px-8 py-3 rounded-xl hover:opacity-90 transition"
        >
          {loading ? "Posting..." : "Submit Review"}
        </button>

      </div>

      {/* ================= REVIEWS ================= */}
      <div className="w-full">

        {reviews.length === 0 && (
          <div className="w-full h-[250px] md:h-[300px] flex flex-col items-center justify-center bg-white rounded-3xl border shadow-sm">
            <p className="text-lg md:text-xl font-medium text-gray-500 mb-2">
              No Reviews Yet
            </p>
            <p className="text-sm text-gray-400">
              Be the first to share your experience ✨
            </p>
          </div>
        )}

        <div className="flex flex-col gap-6 md:gap-8">

          {reviews.map((review) => (
            <div
              key={review.id}
              className="w-full bg-white p-5 md:p-6 rounded-3xl shadow-sm border"
            >

              {/* TOP */}
              <div className="flex items-center justify-between mb-3">

                <div className="flex items-center gap-3 md:gap-4">

                  <img
                    src={
                      review.user?.avatar ||
                      "https://ui-avatars.com/api/?name=" +
                        (review.user?.name || "User")
                    }
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
                  />

                  <div>
                    <p className="text-sm md:text-base font-semibold">
                      {review.user?.name || "User"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>

                </div>

                <button
                  onClick={() => handleDelete(review.id)}
                  className="text-xs md:text-sm text-red-500 hover:underline"
                >
                  Delete
                </button>

              </div>

              {/* ⭐ STARS */}
              <div className="text-yellow-400 text-base mb-2">
                {"★".repeat(review.rating)}
                {"☆".repeat(5 - review.rating)}
              </div>

              {/* COMMENT */}
              <p className="text-sm md:text-base text-gray-700 mb-4">
                {review.comment}
              </p>

              {/* 📸 REVIEW IMAGES */}
              {review.images && review.images.length > 0 && (
                <div className="flex gap-3 flex-wrap">
                  {review.images.map((img) => (
                    <img
                      key={img.id}
                      src={img.image}
                      className="w-24 h-24 object-cover rounded-xl border"
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