import React, { useState, useEffect } from "react";
import { withCookies } from "react-cookie";
import * as PropTypes from 'prop-types';
import NicoNewBook from "./NewBook/NewBook";
import NicoBooksTable from "./NicoBooksTable";
import { getBooks } from "../../api/Requests";
import { logOut, getToken } from "../../services/AuthService";
import Modal from "./Modal";

const Nico = ({cookies, setAuthorised}) => {
  const [books, setBooks] = useState([]);
  const [content, setContent] = useState();

  const addBookToList = book => {
    setBooks([...books, book]);
    setContent();
  }

  const keyDownEvent = ({keyCode}) => {
    if (keyCode === 27) {
      setContent();
    }
  }
  
  const addEscapeListener = _ => {
    addEventListener('keydown', keyDownEvent);
  }
  
  useEffect(() => {
    getBooks(getToken(cookies)).then(setBooks).catch(_ => {
      logOut(cookies);
      setAuthorised(false);
    });
    addEscapeListener();
  }, [])

  const renderNewBookForm = _ => {
    return <NicoNewBook addBookToList={addBookToList} />
  }

  return (
    <>
      <button onClick={_ => setContent(renderNewBookForm())}>Add new book</button>
      <NicoBooksTable books={books} />
      {content && <Modal close={setContent} content={content} />}
    </>
  )
}

const cookies = PropTypes.shape({
    get: PropTypes.func.isRequired,
});

Nico.propTypes = {
    cookies: cookies.isRequired,
    setAuthorised: PropTypes.func.isRequired
};

export default withCookies(Nico);