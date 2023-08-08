import { React, useEffect } from 'react'
import { Link, useLocation,useNavigate } from 'react-router-dom';
const Navbar = () => {
    let location = useLocation();
    useEffect(() => {
    }, [location]);
    let history = useNavigate();
    const handelLogout =() => {
        localStorage.removeItem('token')
     history('/login')
    }
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark ">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">I-Notebook</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} aria-current="page" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`} to="/about">About</Link>
                        </li>
                    </ul>
                </div>
                {!localStorage.getItem('token') ? <form className="d-flex">
                    <Link className="btn btn-primary" to="/login" role="button">Login</Link>
                    <Link className="btn btn-primary mx-2" to="/signup" role="button">SignUp</Link>
                </form> : <button onClick={handelLogout} className='btn btn-primary'>Logout</button>}
            </div>
        </nav>

    )
}

export default Navbar;
