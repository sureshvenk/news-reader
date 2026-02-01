import { NewsArticle } from '../../types';
import { timeAgo, truncateText, getImageUrl } from '../../utils/formatDate';

interface NewsCardProps {
  article: NewsArticle;
  onClick?: () => void;
}

export const NewsCard = ({ article, onClick }: NewsCardProps) => {
  const imageUrl = getImageUrl(article.urlToImage);

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer h-full flex flex-col"
      onClick={onClick}>
      {/* Image Container */}
      <div className="relative w-full h-48 bg-gray-200 overflow-hidden">
        <img
          src={imageUrl}
          alt={article.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle" font-family="Arial" font-size="20" fill="%23999"%3EImage not available%3C/text%3E%3C/svg%3E';
          }}
        />
        <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
          {article.source.name}
        </div>
      </div>

      {/* Content Container */}
      <div className="flex-1 p-4 flex flex-col">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 flex-grow">
          {article.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {article.description || 'No description available'}
        </p>

        {/* Author and Date */}
        <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
          <span className="font-semibold">{article.author || 'Unknown Author'}</span>
          <span>{timeAgo(article.publishedAt)}</span>
        </div>

        {/* Read More Button */}
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-block text-blue-600 hover:text-blue-800 font-semibold text-sm"
        >
          Read More →
        </a>
      </div>
    </article>
  );
};
