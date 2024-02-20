import { useNavigate } from 'react-router-dom';


// File for uplading recepies. When uploaded they will be stored in the backend so you can look at them later 
const Recipes = () => {
    const navigate = useNavigate();    

    return (
       <div> 
        <h1 className="larger-text"> Velkommen til Oppskriftssiden! </h1>
        
        <button onClick={() => navigate('/upload')}>Last opp oppskrifter</button>
       </div>
    );
}

export default Recipes;