import React, { useState, useEffect } from 'react';
import { db } from '../Firebase/FirebaseConfig'; // Assuming you're using Firebase

const AdminPanel = () => {
  const [movies, setMovies] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [poster, setPoster] = useState('');
  const [editingMovieId, setEditingMovieId] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      const snapshot = await db.collection('movies').get();
      const movieList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMovies(movieList);
    };

    fetchMovies();
  }, []);

  const handleAddOrUpdateMovie = async () => {
    const movieData = { title, description, poster };
    if (editingMovieId) {
      // Update movie
      await db.collection('movies').doc(editingMovieId).update(movieData);
    } else {
      // Add new movie
      await db.collection('movies').add(movieData);
    }
    resetForm();
  };

  const handleEditMovie = (movie) => {
    setTitle(movie.title);
    setDescription(movie.description);
    setPoster(movie.poster);
    setEditingMovieId(movie.id);
  };

  const handleDeleteMovie = async (id) => {
    await db.collection('movies').doc(id).delete();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPoster('');
    setEditingMovieId(null);
  };

  return (
    <div>
      <h1>Admin Panel</h1>
      <form onSubmit={(e) => { e.preventDefault(); handleAddOrUpdateMovie(); }}>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required />
        <input type="text" value={poster} onChange={(e) => setPoster(e.target.value)} placeholder="Poster URL" required />
        <button type="submit">{editingMovieId ? 'Update Movie' : 'Add Movie'}</button>
        <button type="button" onClick={resetForm}>Cancel</button>
      </form>

      <h2>Uploaded Movies</h2>
      <ul>
        {movies.map(movie => (
          <li key={movie.id}>
            <h3>{movie.title}</h3>
            <p>{movie.description}</p>
            <img src={movie.poster} alt={movie.title} />
            <button onClick={() => handleEditMovie(movie)}>Edit</ button>
            <button onClick={() => handleDeleteMovie(movie.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPanel;