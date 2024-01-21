import React from 'react';
import Note from './Notes';

const Home = (props) => {
  const {showAlert}= props;
  return (
      <Note showAlert={showAlert} />
  );
};

export default Home;
