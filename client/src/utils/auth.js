import decode from "jwt-decode";
// AuthService that we instantiate a new version for every component that imports it. 
class AuthService {
    // retrieve data saved in token
    getProfile() {
      return decode(this.getToken());
    }
// This checks if the user is still logged in. 
    loggedIn() {
        // Checks if there is a saved token and it's still valid
        const token = this.getToken();
        // use type coersion to check if token is NOT undefined and the token is NOT expired
        return !!token && !this.isTokenExpired(token);
      }
// To check if the token has expired
      isTokenExpired(token) {
        try {
          const decoded = decode(token);
          if (decoded.exp < Date.now() / 1000) {
            return true;
          } else {
            return false;
          }
        } catch (err) {
          return false;
        }
      }

    // This will retrieve the token from the local storage 
      getToken() {
        // Retrieves the user token from localStorage
        return localStorage.getItem("id_token");
      }
      
// This will set the token to the local storage and reload the page to the homepage.
      login(idToken) {
        // Saves user token to localStorage
        localStorage.setItem("id_token", idToken);
    
        window.location.assign("/");
      }
      logout() {
        // Clear user token and profile data from localStorage
        localStorage.removeItem("id_token");
        // this will reload the page and reset the state of the application
        window.location.assign("/");
      }
    }

    const Auth = new AuthService();
    export default Auth;