import {useContext } from 'react';
import { AppContext} from '../App/App';
import './Commentaire.css';

function Commentaire(props) 
{
    const context = useContext(AppContext);

    // Soumettre la note à la BD
    let aCommentaires=[];


    /**
     * Enregistrer le commentaire a la BD
     * @param {HTMLElement} e 
     */
    async function soumettreCommentaire(e)
    {
        e.preventDefault();

        let inputCommentaire =e.target.commentaire.value;

        // Si le champ est saisi
        if(inputCommentaire !== undefined && inputCommentaire !== '')
        {
            // Si c'est pas le première commentaire
            if(props.commentaires) aCommentaires = props.commentaires;
            console.log(context);
            aCommentaires.push({ commentaire: inputCommentaire, usager: 'usager anonyme'});
            // enregistrer le commentaire dans la BD
            props.appelAsync({commentaires: aCommentaires});
        }
        // reinitialiser le champ
        e.target.reset();
    }

    return (
        <form className='commenter mt-sm gap-sm' onSubmit={soumettreCommentaire}>
            <textarea className='commenter__input pt-xxs pb-xxs pl-xxs pr-xxs' name="commentaire" placeholder='Ajouter votre commentaire' rows="8"></textarea>
            <button className="btn btn-dark">Commenter</button>
        </form>
    );
}

export default Commentaire;