const API_URL = 'https://us-central1-top-10-movies-app.cloudfunctions.net/api';

export async function getUserMovies() {
  const token = await auth.currentUser.getIdToken();
  const response = await fetch(`${API_URL}/api/movies`, {
    headers: { 'Authorization': token }
  });
  return response.json();
}

export async function addMovie(movie) {
  const token = await auth.currentUser.getIdToken();
  await fetch(`${API_URL}/api/movies`, {
    method: 'POST',
    headers: {
      'Authorization': token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(movie)
  });
}

export async function removeMovie(movieId) {
  const token = await auth.currentUser.getIdToken();
  await fetch(`${API_URL}/api/movies/${movieId}`, {
    method: 'DELETE',
    headers: { 'Authorization': token }
  });
}
