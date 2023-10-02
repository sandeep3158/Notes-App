import React, { useContext, useEffect, useRef, useState } from 'react'
import noteContext from "../context/noteContext"
import NoteItem from './NoteItem';
import AddNote from './addnote';
import { useNavigate } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
const Notes = (props) => {
    const context = useContext(noteContext);
    const { notes, getNotes, editNote } = context;
    //pagination logic
    const [pageData, setPageData] = useState([]);
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    // handle next
    const handleNext = () => {
        if (page === pageCount) return page;
        setPage(page + 1)
    }

    // handle previous
    const handlePrevios = () => {
        if (page === 1) return page;
        setPage(page - 1)
    }

    let history = useNavigate()
    useEffect(() => {
        if (localStorage.getItem('token')) {
            getNotes();
        }
        else {
            history('/login')
        }
        // eslint-disable-next-line
    }, [page])

    useEffect(() => {
        const pagedatacount = Math.ceil(notes.length / 5);
        setPageCount(pagedatacount);

        if (page) {
            const LIMIT = 4;
            const skip = LIMIT * page // 5 *2 = 10
            const dataskip = notes.slice(page === 1 ? 0 : skip - LIMIT, skip);
            setPageData(dataskip)
        }
        if (page > 1 && pageData < 1)
            setPage(page - 1)

    }, [notes])
    const [sortKey, setSortKey] = useState(""); // State to manage sorting key
    const [sortOrder, setSortOrder] = useState("asc"); // State to manage sorting order

    // Function to handle sorting
    const handleSort = (key) => {
        if (key === sortKey) {
            // Toggle sorting order if the same key is clicked
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            // Default to ascending order for a new key
            setSortKey(key);
            setSortOrder("asc");
        }
    };

    // Sort pageData based on the selected key and order
    const sortedPageData = [...pageData].sort((a, b) => {
        const keyA = (a[sortKey]?.toLowerCase() || ''); // Convert to lowercase for case-insensitive comparison
        const keyB = (b[sortKey]?.toLowerCase() || ''); // Convert to lowercase for case-insensitive comparison
        if (sortOrder === "asc") {
            return keyA < keyB ? -1 : 1;
        } else {
            return keyA > keyB ? -1 : 1;
        }
    });

    const [sortAllowed, setSortAllowed] = useState(false);
    function sortedMap() {
        return sortedPageData.map((note) => (
            <NoteItem key={note._id} updateNote={updateNote} showAlert={props.showAlert} note={note} />
        ))
    }
    function unsortedMap() {
        return pageData.map((note) => (
            <NoteItem key={note._id} updateNote={updateNote} showAlert={props.showAlert} note={note} />
        ))
    }

    function isSort(sortedMap, unsortedMap) {
        if (sortAllowed) {
            return sortedMap();
        }
        else {
            return unsortedMap();
        }

    }
    // for updating note
    const ref = useRef(null)
    const refClose = useRef(null)
    const [note, setNote] = useState({ id: "", etitle: "", edescription: "", etag: "" })

    const updateNote = (currentNote) => {
        ref.current.click();
        setNote({ id: currentNote._id, etitle: currentNote.title, edescription: currentNote.description, etag: currentNote.tag })
    }

    const handleClick = (e) => {
        editNote(note.id, note.etitle, note.edescription, note.etag)
        refClose.current.click();
        props.showAlert('Updated Successfully', 'success')
    }

    const onChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value })
    }

    return (
        <>
            <AddNote showAlert={props.showAlert} />
            <button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Launch demo modal
            </button>
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Edit Note</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form className="my-3">
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">Title</label>
                                    <input type="text" className="form-control" id="etitle" name="etitle" value={note.etitle} aria-describedby="emailHelp" onChange={onChange} minLength={5} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <textarea type="text" className="form-control" id="edescription" name="edescription" value={note.edescription} onChange={onChange} minLength={5} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="tag" className="form-label">Tag</label>
                                    <input type="text" className="form-control" id="etag" name="etag" value={note.etag} onChange={onChange}
                                    />
                                </div>

                            </form>
                        </div>
                        <div className="modal-footer">
                            <button ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button disabled={note.etitle.length < 5 || note.edescription.length < 5} onClick={handleClick} type="button" className="btn btn-primary">Update Note</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-3">
                <input
                    type="checkbox"
                    name="sortCheck"
                    checked={sortAllowed}
                    onChange={() => setSortAllowed((prev) => !prev)}
                />
                <span> Sort by:</span>
                <button className={`btn btn-link ${sortKey === "title" && "active"}`} onClick={() => handleSort("title")}>Title {sortOrder === "asc" ? "▲" : "▼"}</button>
            </div>
            <div className="row my-3">
                <h2>You Notes</h2>
                {
                    pageData.length > 0 ?
                        isSort(sortedMap, unsortedMap)
                        : <div className='d-flex justify-content-center mt-4'>
                            Loading... <Spinner animation="border" variant='danger' />
                        </div>
                }
                <div className='d-flex justify-content-end'>
                    <nav aria-label="Page navigation example">
                        <ul className="pagination justify-content-center">
                            <li className={`page-item ${page === 1 && 'disabled'}`}>
                                <button className="page-link" onClick={handlePrevios} disabled={page === 1}>Previous</button>
                            </li>
                          <li class="page-item page-link">{page}</li>
                            <li className={`page-item ${page === pageCount && 'disabled'}`}>

                                <button className="page-link" onClick={handleNext} disabled={page === pageCount}>Next</button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </>
    )
}

export default Notes
