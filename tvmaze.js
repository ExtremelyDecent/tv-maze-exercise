"use strict";

const $showsList = $("#shows-list");
const $episodesList = $("#episodesList");
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
$("#search-query").val("");
const results = await axios.get(`http://api.tvmaze.com/search/shows?q=`, {
  params:{q:term}});
  console.log(results);
  console.log(results.data);
  return(results.data);
  // return [
  //   {
  //     id: 1767,
  //     name: "The Bletchley Circle",
  //     summary:
  //       `<p><b>The Bletchley Circle</b> follows the journey of four ordinary 
  //          women with extraordinary skills that helped to end World War II.</p>
  //        <p>Set in 1952, Susan, Millie, Lucy and Jean have returned to their 
  //          normal lives, modestly setting aside the part they played in 
  //          producing crucial intelligence, which helped the Allies to victory 
  //          and shortened the war. When Susan discovers a hidden code behind an
  //          unsolved murder she is met by skepticism from the police. She 
  //          quickly realises she can only begin to crack the murders and bring
  //          the culprit to justice with her former friends.</p>`,
  //     image:
  //         "http://static.tvmaze.com/uploads/images/medium_portrait/147/369403.jpg"
  //   }
  // ]
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    try {
      var imgUrl = show.show.image.original;
    } catch (error) {
      imgUrl = 'https://bitsofco.de/content/images/2018/12/broken-1.png';
    }
    const id = show.show.id;
    
    const $show = $(
        `<div data-show-id="${id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
         <img class="card-img-top" src="${imgUrl}">
          
           <div class="media-body">
             <h5 class="text-primary">${show.show.name}</h5>
             <div><small>${show.show.summary}</small></div>
             <button class="btn btn-outline-primary btn-sm Show-getEpisodes"  >
               Get Episodes
             </button>
           </div>
         </div>  
       </div>
      `);
    
    $showsList.append($show);  }
    
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#search-query").val();
  console.log(term);
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});
$showsList.on("click", ".Show-getEpisodes", getEpisodesAndDisplay);

  



/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */
 async function getEpisodesOfShow(id) {
  const response = await axios({
    url: `http://api.tvmaze.com/shows/${id}/episodes`,
    method: "GET",
  });

  return response.data.map(e => ({
    id: e.id,
    name: e.name,
    season: e.season,
    number: e.number,
  }));
}

async function getEpisodesAndDisplay(evt) {
  const showId = $(evt.target).closest(".Show").data("show-id");
  const episodes = await getEpisodesOfShow(showId);
  console.log(episodes);
  populateEpisodes(episodes);
}

/**Iterate over episode in episodes and appends LI to dom. */

function populateEpisodes(episodes) {
  $episodesList.empty();
  for (let episode of episodes) {
    const $item = $(
        `<li>
         ${episode.name}
         (season ${episode.season}, episode ${episode.number})
       </li>
      `);

    $episodesList.append($item);
  }

  $episodesArea.show();
}
