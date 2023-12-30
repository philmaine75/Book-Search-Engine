import decode from 'jwt-decode';

class AuthService {
  getProfile() {
    return decode(this.getToken());
  }

  loggedIn() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      return decoded.exp < Date.now() / 1000;
    } catch (err) {
      return false;
    }
  }

  getToken() {
    return localStorage.getItem('id_token');
  }

  login(idToken) {
    // Assuming the token needs to be sent in the Authorization header
    // You might need to adjust this based on your GraphQL server requirements
    localStorage.setItem('id_token', idToken);
    // You might want to set the token in the header of your GraphQL requests here
    // Example: axios.defaults.headers.common['Authorization'] = `Bearer ${idToken}`;
    window.location.assign('/');
  }

  logout() {
    localStorage.removeItem('id_token');
    // Clear the token from the header of your GraphQL requests
    // Example: delete axios.defaults.headers.common['Authorization'];
    window.location.assign('/');
  }
}

export default new AuthService();