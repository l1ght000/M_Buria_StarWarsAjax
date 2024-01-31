(() => {
  const characterBox = document.querySelector("#character-box");
  const movieDetailsCon = document.querySelector("#movie-details-con");
  const characterImageCon = document.querySelector("#character-image");
  const moviePoster = document.querySelector("#movie-poster");
  let loadingIcon = createLoadingIcon();
  const baseUrl = `https://swapi.dev/api/people/`;

  function createLoadingIcon() {
    let icon = document.querySelector('#loading-icon');
    if (!icon) {
      icon = document.createElement('div');
      icon.id = 'loading-icon';
      icon.className = 'loading-hidden center-content';
      document.body.appendChild(icon);
    }
    return icon;
  }

  function showLoading(context) {
    const parent = context === 'characters' ? characterBox : movieDetailsCon;
    if (parent) {
      parent.appendChild(loadingIcon);
      loadingIcon.classList.remove('loading-hidden');
    }
  }

  function hideLoading() {
    loadingIcon.classList.add('loading-hidden');
  }

  function getCharacters() {
    showLoading('characters');
    fetch(baseUrl)
      .then(response => response.json())
      .then(data => {
        displayCharacterList(data.results);
      })
      .catch(console.error)
      .finally(hideLoading);
  }

  function displayCharacterList(characters) {
    const ul = document.createElement("ul");
    characters.forEach(character => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.textContent = character.name;
      a.href = "#";
      a.addEventListener("click", event => {
        event.preventDefault();
        showLoading('movie');
        getCharacterMovies(character.url);
      });
      li.appendChild(a);
      ul.appendChild(li);
    });
    characterBox.appendChild(ul);
  }

  function getCharacterMovies(characterUrl) {
    fetch(characterUrl)
      .then(response => response.json())
      .then(character => {
        const movieUrls = character.films;
        if (movieUrls.length > 0) {
          const randomMovieUrl = movieUrls[Math.floor(Math.random() * movieUrls.length)];
          getMovieDetails(randomMovieUrl);
          displayCharacterImage(character.name);
        } else {
          hideLoading();
        }
      })
      .catch(console.error)
      .finally(hideLoading);
  }

  function getMovieDetails(movieUrl) {
    fetch(movieUrl)
      .then(response => response.json())
      .then(movie => {
          displayMovieDetails(movie);
      })
      .catch(console.error)
      .finally(hideLoading);
  }

  function displayMovieDetails(movie) {
    movieDetailsCon.innerHTML = ''; 
    const title = document.createElement("h3");
    title.textContent = movie.title;
    const openingCrawl = document.createElement("p");
    openingCrawl.textContent = movie.opening_crawl;
    movieDetailsCon.appendChild(title);
    movieDetailsCon.appendChild(openingCrawl);
    
    // Ensure the movie poster is cleared and updated
    moviePoster.innerHTML = '';
    const posterImg = document.createElement("img");
    posterImg.src = getPosterPath(movie.episode_id);
    posterImg.alt = `Poster of ${movie.title}`;
    posterImg.classList.add("movie-poster-image");
    moviePoster.appendChild(posterImg);
  }

  function displayCharacterImage(characterName) {
    characterImageCon.innerHTML = ''; // Clear previous content
    const imagePath = getCharacterImagePath(characterName);
    const img = new Image();
    img.onload = hideLoading;
    img.src = imagePath;
    img.alt = `Image of ${characterName}`;
    characterImageCon.appendChild(img);
  }

  function getCharacterImagePath(characterName) {
    const formattedName = characterName.toLowerCase().replace(/ /g, '_');
    return `images/${formattedName}.png`;
  }

  function getPosterPath(episodeId) {
    return `images/episode_${episodeId}.jpg`;
  }

  getCharacters();

  
})();
