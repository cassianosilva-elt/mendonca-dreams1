
import React, { useState } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { MOCK_REVIEWS } from '../constants';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const ReviewSection: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [reviews] = useState(MOCK_REVIEWS);
  const avgRating = 4.5;

  return (
    <div className="mt-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
        <div>
          <h2 className="text-3xl font-serif text-navy mb-2">Avaliações</h2>
          <div className="flex items-center space-x-4">
            <div className="flex text-navy">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill={i < Math.floor(avgRating) ? "currentColor" : "none"} />
              ))}
            </div>
            <span className="text-sm text-gray-400 font-medium">{avgRating} / 5.0 ({reviews.length} avaliações)</span>
          </div>
        </div>
        
        {!isAuthenticated && (
          <div className="mt-6 md:mt-0 p-4 bg-gray-50 rounded-lg flex items-center space-x-3">
            <MessageSquare size={20} className="text-navy/40" />
            <p className="text-sm text-gray-500">
              Deseja avaliar? <Link to="/login" className="text-navy font-bold hover:underline">Entre na sua conta</Link>
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {reviews.map(review => (
          <div key={review.id} className="p-8 border border-gray-100 bg-white shadow-sm rounded-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-semibold text-navy">{review.userName}</h4>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest">{review.date}</p>
              </div>
              <div className="flex text-navy">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} />
                ))}
              </div>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed italic">"{review.comment}"</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSection;
