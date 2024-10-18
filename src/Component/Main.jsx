import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchEpisodes, fetchCharacters, fetchEpisodeCharacters, resetCharacters } from '../episodeSlice';

const ImageFeed = () => {
  const dispatch = useDispatch();
  const { episodes, characters, selectedEpisode } = useSelector((state) => state.episodes);

  // Local state for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const charactersPerPage = 6;

  // Fetch episodes on mount
  useEffect(() => {
    dispatch(fetchEpisodes());
  }, [dispatch]);

  // Calculate the index range for the current page
  const indexOfLastCharacter = currentPage * charactersPerPage;
  const indexOfFirstCharacter = indexOfLastCharacter - charactersPerPage;
  const currentCharacters = characters.slice(indexOfFirstCharacter, indexOfLastCharacter);

  // Calculate total pages
  const totalPages = Math.ceil(characters.length / charactersPerPage);

  // Handle page click
  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle Next and Prev buttons
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Find the selected episode name
  const selectedEpisodeDetails = episodes.find((episode) => episode.id === selectedEpisode);
  const selectedEpisodeName = selectedEpisodeDetails ? selectedEpisodeDetails.name : '';

  return (
    <div className="flex flex-col justify-center p-4 ml-0 text-center md:flex-row md:ml-72 ">
      {/* Sidebar for Episodes (responsive) */}
      <div className="top-0 left-0 w-full h-full p-4 bg-gray-200 md:w-1/4 md:fixed md:h-full">
        <h2 className="mb-4 text-xl font-bold text-gray-800">Episodes</h2>
        <ul className="overflow-y-auto h-80 md:h-[calc(100vh-150px)]">
          {episodes.map((episode) => (
            <li
              key={episode.id}
              className={`cursor-pointer text-white py-2 px-3 mb-2 ${selectedEpisode === episode.id ? 'bg-red-300' : 'bg-red-900'} hover:bg-red-600`}
              onClick={() => {
                dispatch(fetchEpisodeCharacters(episode)); // Fetch characters for selected episode
                setCurrentPage(1); // Reset to page 1 when episode changes
              }}
            >
              {episode.name}
            </li>
          ))}
        </ul>
        <button
          className="w-full px-4 py-2 mt-4 text-white bg-red-500 rounded"
          onClick={() => dispatch(resetCharacters())}
        >
          Reset Characters
        </button>
      </div>

      <div className="w-full p-4 md:w-3/4 md:ml-1/4" >
        <h2 className="mb-3 text-2xl font-bold">Rick and Morty Character</h2>
        <h2 className="mb-3 text-xl">{characters.length > 0 ? `${characters.length} Characters in episode ${selectedEpisodeName}` : 'No Characters Selected.'}</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
          {currentCharacters.length > 0 ? (
            currentCharacters.map((character) => (
              <div key={character.id} className="p-2 overflow-hidden border border-gray-300">
                <div className="h-48 overflow-hidden">
                  <img
                    src={character.image}
                    alt={character.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <h3 className="mt-2 text-center">{character.name}</h3>
              </div>
            ))
          ) : (
            <p className="col-span-3 text-center"></p>
          )}
        </div>

        {currentCharacters.length > 0 && totalPages > 1 && (
          <div className="flex justify-center mt-4 space-x-2">
            {currentPage > 1 && (
              <button
                className="px-4 py-2 text-white bg-gray-600 rounded"
                onClick={handlePrevPage}
              >
                Previous
              </button>
            )}

            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                className={`px-4 py-2 rounded ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                onClick={() => handlePageClick(index + 1)}
              >
                {index + 1}
              </button>
            ))}

            {currentPage < totalPages && (
              <button
                className="px-4 py-2 text-white bg-gray-600 rounded"
                onClick={handleNextPage}
              >
                Next
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageFeed;
