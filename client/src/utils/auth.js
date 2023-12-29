import { ApolloClient, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import decode from 'jwt-decode';
import { GET_ME } from './queries';

class AuthService {
  constructor() {
    // Initialize Apollo Client with a link that includes the authentication token
    this.client = new ApolloClient({
      uri: 'http://localhost:3001/graphql', 
      cache: new InMemoryCache(),
      link: this.createAuthLink(),
    });
  }

  // Create an Apollo Link to include the authentication token in the request headers
  createAuthLink() {
    return setContext((_, { headers }) => {
      const token = this.getToken();
      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : '',
        },
      };
    });
  }

  // Get user data from the server
  async getProfile() {
    
    try {
      const { data } = await this.client.query({
        query: GET_ME, 
      });
      return data.user; // Adjust this based on your GraphQL schema
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  // Check if user is logged in
  loggedIn() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  // Check if the token is expired
  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      return decoded.exp < Date.now() / 1000;
    } catch (err) {
      return false;
    }
  }

  // Get the authentication token from localStorage
  getToken() {
    return localStorage.getItem('id_token');
  }

  // Save the authentication token to localStorage
  login(idToken) {
    localStorage.setItem('id_token', idToken);
  }

  // Clear the authentication token from localStorage
  logout() {
    localStorage.removeItem('id_token');
  }
}

export default new AuthService();
