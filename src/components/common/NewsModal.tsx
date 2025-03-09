// src/components/common/NewsModal.tsx
import React from 'react';
import { X } from 'lucide-react';

interface NewsArticle {
  title: string;
  description: string;
  content: string;
  url: string;
  publishedAt: string;
  sentiment_score: number;
  source: {
    id: string | null;
    name: string;
  };
}

interface NewsModalProps {
  articles: NewsArticle[] | null;
  isOpen: boolean;
  onClose: () => void;
  error: string | null;
  destination: string;
}

const NewsModal: React.FC<NewsModalProps> = ({ articles, isOpen, onClose, error, destination }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
          <div className="pointer-events-auto w-screen max-w-md">
            <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
              <div className="bg-primary-700 py-6 px-4 sm:px-6">
                <div className="flex items-start justify-between space-x-3">
                  <h2 className="text-lg font-medium text-white" id="slide-over-title">
                    News for {destination}
                  </h2>
                  <div className="ml-3 flex h-7 items-center">
                    <button
                      type="button"
                      className="rounded-md bg-transparent text-primary-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                      onClick={onClose}
                    >
                      <span className="sr-only">Close panel</span>
                      <X className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                <div className="py-6 px-4 sm:px-6">
                  {error ? (
                    <div className="text-red-600">Error: {error}</div>
                  ) : articles === null ? (
                    <p>Loading...</p>
                  ) : articles.length === 0 ? (
                    <p>No relevant news articles found.</p>
                  ) : (
                    <ul className="list-disc pl-5">
                      {articles.map((article, index) => (
                        <li key={index} className="mb-2">
                          <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            {article.title}
                          </a>
                          <p className="text-sm text-gray-600">{article.description}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsModal;
