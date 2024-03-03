import './Film.css';
import { useParams } from 'react-router-dom';
import React, { useEffect, useState, useContext } from 'react';
import Vote from '../Vote/Vote';
import { AppContext} from '../App/App';
import Commentaire from '../Commentaire/Commentaire';


function Film() 
{
  const context = useContext(AppContext);

  // Afficher les infos du film par son id au chargement de la page
  const {id} = useParams();
  const urlFilm = `https://cadriel-front.onrender.com/films/${id}`;
  // const urlFilm = `data/titre-asc.json/${id}`; 

  useEffect(()=>
  {
    fetch(urlFilm)
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        handleFilm(data);
      })
  }, [urlFilm]);

  // Tracer le changement d'état du film
  const [film, setFilm] = useState({});

  // Tracer le changement d'état des stats des votes
  const [moyenne, setMoyenne] = useState('Aucun vote enregistré');
  const [nbVotes, setNbVotes] = useState(0);
  // const [domCommentaires, setDomCommentaires] = useState();
  
  // Créer le dom des genres
  const genres = film.genres?.map((genre, index)=>{
    return  <small key={index}>{genre} | </small>
  })

  const domCommentaires = film.commentaires?.map((commentaire, index)=>{
    return <p key={index}> <span>{commentaire.commentaire} </span> <span>{commentaire.usager} </span></p>
  });

  // Mettre à jour le film
  function handleFilm(data)
  {
    // Mettre à jour les infos du film  
    setFilm(data);

    // Gérer l'affichage des votes
    let noteTotale = data.notes;
    // console.log(noteTotale);

    if (noteTotale)        
    {
      // Référence : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed
      let noteMoyenne = (noteTotale.reduce((a, b) => a+b, 0)/ noteTotale.length).toFixed(2),
          nbVotes = noteTotale.length;

      setMoyenne(noteMoyenne);
      setNbVotes(nbVotes);
    }
  }


  async function appelAsync(data)
  {
    const oOptions = 
    {
        method: 'PUT',
        headers: 
        {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
        // body: JSON.stringify(data)
    }

    // PUT pour modifier le champ de notes du film 
    let putCommentaire = await fetch(urlFilm, oOptions),
    // GET pour afficher à nouveau les votes 
        getFilm = await fetch(urlFilm);

    Promise.all([putCommentaire, getFilm])
        .then(respone => respone[1].json())
        .then((data) => {
        //   console.log(data);
        handleFilm(data);
        })      
    }

  
  return (
    <main className="film">

      <div>
        <div className="film__img">
          <img src={`../img/${film.titreVignette}`} alt={film.titre}/>
        </div>

        <h1>{film.titre}</h1>
        <p>{film.realisation}</p>
        <p>{genres}</p>
        <p>{film.annee}</p>


        <p>Moyenne : {moyenne} </p>
        <p>Nombre de { nbVotes === 1 ? 'vote' : 'votes' }  : {nbVotes} </p>
        <Vote notes={film.notes} urlFilm={urlFilm} handleFilm={handleFilm} appelAsync={appelAsync}/>

        {context.estLog? 
          <Commentaire commentaires={film.commentaires} urlFilm={urlFilm} handleFilm={handleFilm} appelAsync={appelAsync}/>
        : ''}
        {domCommentaires}

      </div>
  </main>
  );
}

export default Film;