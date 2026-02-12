
import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Send } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../convex/_generated/api';

const convexUrl = import.meta.env.VITE_CONVEX_URL;
const client = convexUrl ? new ConvexHttpClient(convexUrl) : null;

const ReviewSection: React.FC = () => {
  const { slug } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { getProductBySlug } = useProducts();
  const product = getProductBySlug(slug || '');

  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  const fetchReviews = async () => {
    if (!product || !client) return;
    setIsLoading(true);
    try {
      const data = await client.query(api.reviews.getByProductId, { productId: product.id as any });
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [product]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !product || !comment.trim() || !client) return;

    setIsSubmitting(true);
    try {
      await client.mutation(api.reviews.add, {
        productId: product.id as any,
        userId: user.id,
        userName: user.name,
        rating,
        comment: comment.trim()
      });
      setComment('');
      setRating(5);
      await fetchReviews();
      alert('Obrigada por sua avaliação! Ela foi publicada no site.');
    } catch (error) {
      console.error('Error adding review:', error);
      alert('Erro ao enviar avaliação.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "5.0";

  return (
    <div className="mt-20">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-20 border-b border-gray-100 pb-12">
        <div className="flex-1">
          <h2 className="text-3xl font-serif text-navy mb-4">Experiências Dreams</h2>
          <div className="flex items-center space-x-6">
            <div className="flex text-navy gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} fill={i < Math.floor(Number(avgRating)) ? "currentColor" : "none"} strokeWidth={1} />
              ))}
            </div>
            <span className="text-xl text-navy font-light italic">{avgRating} <span className="text-sm text-gray-300 not-italic ml-2">/ 5.0 ({reviews.length} avaliações)</span></span>
          </div>
        </div>

        {isAuthenticated ? (
          <form onSubmit={handleReviewSubmit} className="flex-1 w-full bg-gray-50/50 p-8 rounded-sm border border-gray-100">
            <p className="text-[10px] tracking-[0.3em] uppercase font-bold text-navy/40 mb-6">Deixe sua Impressão</p>
            <div className="mb-6">
              <div className="flex gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      size={24}
                      fill={(hoverRating || rating) >= star ? "#000080" : "none"}
                      stroke={(hoverRating || rating) >= star ? "#000080" : "#000080"}
                      strokeWidth={1}
                    />
                  </button>
                ))}
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Compartilhe sua experiência com esta peça artesanal..."
                className="w-full h-32 bg-white border border-gray-100 p-4 text-sm font-light focus:border-navy outline-none transition-colors resize-none italic"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting || !comment.trim()}
              className="flex items-center gap-3 bg-navy text-white px-8 py-4 text-[11px] tracking-[0.3em] font-bold uppercase hover:bg-navy/90 transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Enviando...' : (
                <>
                  <span>Publicar Avaliação</span>
                  <Send size={14} />
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="flex-1 w-full p-8 bg-gray-50 border border-dash border-gray-200 flex flex-col items-center text-center">
            <MessageSquare size={32} className="text-navy/10 mb-4" />
            <p className="text-sm text-gray-500 font-light max-w-xs mb-6 italic">
              Apenas clientes autenticados podem compartilhar suas impressões sobre nossas coleções.
            </p>
            <Link
              to="/login"
              className="bg-navy text-white px-8 py-3 text-[10px] tracking-[0.3em] font-bold uppercase hover:opacity-90"
            >
              Entrar na Conta
            </Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {isLoading ? (
          <div className="col-span-full py-12 text-center text-gray-400 text-xs tracking-widest uppercase animate-pulse">
            Sincronizando experiências...
          </div>
        ) : reviews.length > 0 ? (
          reviews.map(review => (
            <div key={review.id} className="p-10 border border-gray-50 bg-white hover:border-gray-100 transition-colors group">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="font-semibold text-navy tracking-tight">{review.user_name}</h4>
                  <p className="text-[9px] text-gray-300 uppercase tracking-widest mt-1">
                    {new Date(review.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <div className="flex text-navy gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} strokeWidth={1.5} />
                  ))}
                </div>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed italic font-light group-hover:text-navy transition-colors">
                "{review.comment}"
              </p>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center border border-dashed border-gray-100">
            <p className="text-gray-400 font-serif italic text-lg mb-2">Ainda não há avaliações para esta peça.</p>
            <p className="text-[9px] tracking-[0.2em] font-bold text-navy/30 uppercase">Seja a primeira a compartilhar sua experiência.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
