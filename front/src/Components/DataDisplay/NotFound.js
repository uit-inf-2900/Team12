import {Link} from "react-router-dom";
import "../../GlobalStyles/main.css";


const NotFound = () => {
    return (
      <div className="page-container" style={{ justifyContent: "center", alignItems: "row"}}>
        <h1>404 - Page Not Found</h1>
        <p>Sorry, the page you are looking for could not be found.</p>
        <p> Go back to the <Link to='/'> home page </Link> </p>
    </div>
    );
  };

export default NotFound;