import React from 'react';

import { PlaygroundProjectCard, PlaygroundProjectCreateCard } from './PlaygroundProjectCard';



const PlaygroundProjectsList = ({ projects, mode }) => {
  const sortedProjects = [...projects].sort((a, b) => 
    new Date(b.updated_at) - new Date(a.updated_at)
  );

  return (
    <div className='grid gap-4 lg:grid-cols-3 xl:grid-cols-3 md:grid-cols-2 sm:grid-cols-1'>
        <PlaygroundProjectCreateCard />
      {sortedProjects.map((project) => (
        <PlaygroundProjectCard project={project} key={project._id} />
      ))}
    </div>
  );
};

export default PlaygroundProjectsList;