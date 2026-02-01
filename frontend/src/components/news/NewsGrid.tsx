import { NewsArticle } from '../../types';
import { NewsCard } from './NewsCard';

interface NewsGridProps {
  articles: NewsArticle[];
  onArticleClick?: (article: NewsArticle) => void;
}

export const NewsGrid = ({ articles, onArticleClick }: NewsGridProps) => {
  if (articles.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
      {articles.map((article) => (
        <NewsCard
          key={article.url}
          article={article}
          onClick={() => onArticleClick?.(article)}
        />
      ))}
    </div>
  );
};
