import {Link} from "react-router-dom";
import "../../GlobalStyles/main.css";

/**
 * Component for sending a 404 page when a route is not found.
 */
const NotFound = () => {
    return (
      <div className="page-container" style={{ justifyContent: "center", alignItems: "row"}}>
        {/* Tell the user that the page is not found, and provide a link to the home page */}
        <h1>404 - Page Not Found</h1>
        <p>Sorry, the page you are looking for could not be found.</p>
        <p> Go back to the <Link to='/'> home page </Link> </p>
    </div>
    );
  };

export default NotFound;