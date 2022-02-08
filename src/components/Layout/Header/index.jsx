import axios from "utilities/axios";

import PropTypes from "prop-types";
import { SvgIcon } from "../../../common/SvgIcon";
import React, { useState, useEffect} from "react";
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Container from 'react-bootstrap/Container'
import Link from "common/Link";
import isEmpty from "lodash/isEmpty";
import GoogleSignIn from "../../GoogleSignIn";
import styles from "./Header.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown, faUserEdit } from '@fortawesome/free-solid-svg-icons';


export default function Header({ isAuthenticated, setLoggedIn, setLoggedOut }) {

    const [data, setData] = useState();
    const [googleState, setGoogleState] = useState("button");
    const [expanded, setExpanded] = useState(!isAuthenticated);
    const [username, setUsername] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [isMember, setIsMember] = useState(false);

    const clubPeopleList = {
      admin: [
        {
          name: 'Byld',
          username: 'byld',
        },
      ],
      member: [
        {
          name: 'Rahul Bansal',
          username: 'wit',
        },
      ],
    };

    useEffect(() => {
        if (isEmpty(data) && isAuthenticated)
            axios.get(`connect/profile`)
                .then(res => {
                    setData(res.data[0]);
                    setUsername(
                      res.data[0].First_Name + ' ' + res.data[0].Last_Name
                    );                
                }).catch(err => console.log(err))
        
    }, [data, isAuthenticated]);
    
    useEffect(() => {
        const admin = clubPeopleList.admin.findIndex(i=>i.name.toLowerCase()===username.toLowerCase());

        const member = clubPeopleList.member.findIndex(
          (i) => i.name.toLowerCase() === username.toLowerCase()
        );
        
        setIsAdmin(admin === -1 ? false : true);
        setIsMember(member === -1 ? false : true);

    }, [username]);
    

    useEffect(() => {
        if (isAuthenticated && expanded)
            setExpanded(false);
    }, [isAuthenticated])

     

    return (
        <Navbar
            bg="dark"
            className={styles.navbar + " sticky-top mb-4 "}
            collapseOnSelect
            expand="lg"
            expanded={expanded}
            onToggle={() => setExpanded(!expanded)}
            variant="dark"
        >
            <Container>
                <Navbar.Brand href="#home">
                    <Link
                        aria-label="homepage"
                        className='col-auto'
                        to="/"
                    >
                        <SvgIcon
                            className="col-"
                            height="60px"
                            src="logo.png"
                            width="250px"
                        />
                    </Link>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="responsive-navbar-nav" />

                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto" />

                    <Nav>


                        {(isAuthenticated && data ) ?
                            <NavDropdown
                                id="dropdown-button-drop-start"
                                title="Club Management"
                            >
                                <ul
                                    className=" p-0 m-0"
                                    style={{listStyle: "none"}}
                                >
                                    {data.clubs?.map((club) => (
                                        <Link
                                            className="reset-a cursor-pointer"
                                            key={club.id}
                                            to={`/manage/${club.username}/`}
                                        >
                                            <NavDropdown.Item
                                                as="span"
                                                className='d-flex align-items-center justify-content-between'
                                            >
                                                { club.name }
                                               
                                                { isMember && <FontAwesomeIcon
                                                    color='orange'
                                                    icon={faUserEdit}
                                                              /> }

                                                { isAdmin && <FontAwesomeIcon
                                                    color='orange'
                                                    icon={faCrown}
                                                             /> }
                                            </NavDropdown.Item>
                                        </Link>
                                        ))}
                                </ul>
                            </NavDropdown>

                            : null}

                        {(isAuthenticated) ?

                            <NavDropdown
                                id="dropdown-button-drop-start"
                                title={username}

                            >
                                <NavDropdown.Item href="/profile">
                                    My Profile
                                </NavDropdown.Item>

                                <NavDropdown.Item href="/history">
                                    Your Events
                                </NavDropdown.Item>

                                <NavDropdown.Divider />



                                {/* <AccountChooser
                                    data={data}
                                    isAuthenticated={isAuthenticated}
                                /> */}


                                {isAuthenticated ?
                                    <div>
                                        <Nav.Link
                                            className={styles.signoutBtn  + " text-light text-center w-75"}
                                            href="/"
                                            onClick={setLoggedOut}
                                        >
                                            Sign out
                                        </Nav.Link>
                                    </div>
                            : null}
                            </NavDropdown>
                        : null }

                        <NavDropdown.Divider />


                        {!isAuthenticated?
                            <GoogleSignIn
                                isAuthenticated={isAuthenticated}
                                setLoggedIn={setLoggedIn}
                                setStage={setGoogleState}
                                stage={googleState}
                                visibility
                            />
                        : null}


                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}


Header.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    setLoggedIn: PropTypes.func.isRequired,
    setLoggedOut: PropTypes.func.isRequired,
}
