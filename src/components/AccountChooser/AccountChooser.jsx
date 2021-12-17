import React from "react";
import PropTypes from "prop-types";
import 'react-bootstrap';
import styles from './accountchooser.module.css';
import Link from "common/Link";
import NavDropdown from 'react-bootstrap/NavDropdown'
import Image from 'react-bootstrap/Image';

export default function AccountChooser({...props}) {

    if(props.data === undefined){return null}

    return (
        <>
            <div className="justify-content-end row">
                <div className="col-md-3">
                    <Image
                        alt="Profile Image"
                        className="rounded-circle"
                        height="70px"
                        src="https://cdn3.iconfinder.com/data/icons/avatars-round-flat/33/man5-512.png"
                        width="70px"
                    />
                </div>

                <div className="col-md-9">
                    <p className="d-flex flex-column pl-4">
                        <h3>

                            { " "}

                            {props.data.First_Name} 

                            {" "}

                            {props.data.Last_Name} 

                        </h3>

                        <Link
                            internal
                            to="/profile"
                        >
                            <span >
                                Manage Profile
                            </span>
                        </Link>
                
                    </p>
                </div>
            </div>

            {props.isAuthenticated ?
                <NavDropdown.Item>
                    <h5>
                        Club Management
                    </h5>

                    <div className={styles.clubScroll}>
                        <ul className={styles.clubNames}>
                            {props.data.clubs?.map((club) => (
                                <li key={club.id}>
                                    {club.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                </NavDropdown.Item>
            : null }
        </>)
}


AccountChooser.defaultProps = {
    data: {First_Name:"User", Last_Name:"Name"},
    isAuthenticated: false,
};

AccountChooser.propTypes = {
    data: PropTypes.objectOf(PropTypes.string),
    isAuthenticated: PropTypes.bool,
};