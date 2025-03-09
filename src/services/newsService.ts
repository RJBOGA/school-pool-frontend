// src/services/newsService.ts
import axios from 'axios'; // Import axios
import api from './api';

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

interface FilteredNewsResponse {
  articles: NewsArticle[];
  average_sentiment: number;
}

class NewsService {

  // Create a separate axios instance with the correct baseURL
  private newsApi = axios.create({
    baseURL: 'http://127.0.0.1:5000',  //  News API base URL
    headers: {
      'Content-Type': 'application/json',
    },
  });

  private readonly BASE_PATH = '/news';


  async getNewsByZipCode(zipcode: string): Promise<NewsArticle[]> {
    try {
      const response = await this.newsApi.get<NewsArticle[]>(`${this.BASE_PATH}/zipcode/${zipcode}`); // Use newsApi
      return response.data;
    } catch (error) {
      console.error("Error fetching news by zipcode:", error);
      throw error;
    }
  }

  async getFilteredNewsAndSentimentByZipCode(zipcode: string): Promise<FilteredNewsResponse> {
    try {
      const response = await this.newsApi.get<FilteredNewsResponse>(`${this.BASE_PATH}/zipcode/${zipcode}/filtered_sentiment`);  // Use newsApi
      return response.data;
    } catch (error) {
      console.error("Error fetching filtered news and sentiment by zipcode:", error);
      throw error;
    }
  }

  async getFilteredNewsAndSentimentByGeo(latitude: number, longitude: number): Promise<FilteredNewsResponse> {
    try {
      const response = await this.newsApi.get<FilteredNewsResponse>(`${this.BASE_PATH}/geo/${latitude}/${longitude}/filtered_sentiment`); // Use newsApi
      return response.data;
    } catch (error) {
      console.error("Error fetching filtered news and sentiment by geo:", error);
      throw error;
    }
  }
}

export default new NewsService();
