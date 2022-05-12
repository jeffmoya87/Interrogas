import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import tempLogo from '../../assets/images/int.png';
import './layoutpublic.css';
import PropTypes from 'prop-types';
import * as userServices from '../../services/usersService';
import { useNavigate, Link } from 'react-router-dom';
import logger from 'sabio-debug';

const _logger = logger.extend('NavBar');

function NavBar(props) {
    const user = props.cUser;
    const setUser = props.reSetUser;
    const navigate = useNavigate();

    const onLogoutClicked = (e) => {
        e.preventDefault();
        userServices.logout().then(onLogoutSuccess).catch(onLogoutFail);
    };

    const onLogoutSuccess = () => {
        setUser((prevState) => {
            const afterLogout = {
                email: '',
                roles: [],
                id: 0,
                isLoggedIn: false,
            };
            const newDefault = { ...prevState, ...afterLogout };
            return newDefault;
        });
        navigate('/');
    };

    const onLogoutFail = (err) => {
        _logger('logout fail', err);
    };

    return (
        <React.Fragment>
            <div className="mx-3 navBottomBorder">
                <div className="container">
                    <Navbar collapseOnSelect expand="md" className="mx-auto mx-3 py-md-2 navbar bg-transparent">
                        <Link to="/" className="me-lg-2 navbar-brand">
                            <img src={tempLogo} alt="placeholder logo" className="companyLogo mx-2 my-2"></img>
                        </Link>

                        <Navbar.Toggle aria-controls="responsive-navbar-nav" className="navbar-toggler">
                            <i className="mdi mdi-menu navText"></i>
                        </Navbar.Toggle>

                        <Navbar.Collapse id="responsive-navbar-nav" className="navbar-collapse  ">
                            <Nav className="me-auto align-items-center navbar-nav ">
                                <Nav.Item className="mx-1 nav-public-item">
                                    <Link to="/mexicoElections" className="navText col-auto my-1">
                                        Elections
                                    </Link>
                                </Nav.Item>

                                <Nav.Item className="mx-1 nav-public-item">
                                    <Link to="/polls" className="navText col-auto my-1">
                                        Polls
                                    </Link>
                                </Nav.Item>

                                <Nav.Item className="mx-1 nav-public-item">
                                    <Link to="/pollsters" className="navText col-auto my-1">
                                        Pollsters
                                    </Link>
                                </Nav.Item>

                                {user.isLoggedIn && (
                                    <Nav.Item className="mx-1 nav-public-item">
                                        <Link to="/dashboard/campaign" className="navText navCollapse col-auto my-1">
                                            Dashboard
                                        </Link>
                                    </Nav.Item>
                                )}

                                {/* <Nav.Item className="mx-1">
                                <input
                                    type="text"
                                    className="mx-1 px-2 form-control"
                                    name="searchQuery"
                                    placeholder="search"
                                />
                            </Nav.Item>
                            <Nav.Item className="">
                                <Button type="submit" className="btn btn-light mx-1 my-1">
                                    <i className="mdi mdi-magnify mx-1" />
                                </Button>
                            </Nav.Item> */}

                                <Nav.Item className="mx-1 nav-public-item"></Nav.Item>
                            </Nav>
                            {user.isLoggedIn ? (
                                <form className="form-inline">
                                    <button
                                        onClick={onLogoutClicked}
                                        className="btn btn-outline btn-primary navCollapse col-auto my-1 px-2">
                                        <label>Logout</label>
                                    </button>
                                </form>
                            ) : (
                                <>
                                    <Link
                                        to="/register"
                                        className="btn btn-primary navCollapse col-auto my-1 px-2 mx-1">
                                        <label>Subscribe</label>
                                    </Link>
                                    <Link to="/login" className="btn btn-light navCollapse col-auto my-1 px-2">
                                        <label>Login</label>
                                    </Link>
                                </>
                            )}
                        </Navbar.Collapse>
                    </Navbar>
                </div>
            </div>
        </React.Fragment>
    );
}

NavBar.propTypes = {
    cUser: PropTypes.shape({
        id: PropTypes.number.isRequired,
        roles: PropTypes.arrayOf(PropTypes.string).isRequired,
        email: PropTypes.string.isRequired,
        isLoggedIn: PropTypes.bool.isRequired,
    }),
    reSetUser: PropTypes.func,
};

export default NavBar;
