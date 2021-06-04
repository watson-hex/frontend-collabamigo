import {Link, Route, Switch} from "react-router-dom";
import Collab from "../Collab/Collab";
import Card from "react-bootstrap/Card";
import React from "react";

function AuthenticatedHome() {
    return (
        <div>
            <Switch>
                <Route
                    exact
                    path="/"
                >
                    <Collab
                        className="jumbotron"
                        title="Collab Connect"
                    />

                    {/*<DarkMode />*/}
                </Route>
            </Switch>

            <section>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4 mb-4">
                            <Card className="card_main help_card_main text-secondary card">
                                <img
                                    alt=""
                                    className="card-img-top"
                                    src="https://images.unsplash.com/photo-1495653797063-114787b77b23?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
                                />

                                <Card.Body>
                                    <Card.Title className="card-title font-weight-bold">
                                        HELP OTHERS
                                    </Card.Title>

                                    <br />

                                    <Card.Text className="card-text masthead">
                                        Solve other&apos;s doubts and be the mentor you always wanted.
                                        Using our platform you can reach a larger curious community.
                                    </Card.Text>

                                    <Link
                                        className="col-auto btn btn-primary"
                                        to="/help"
                                    >
                                        Help others
                                    </Link>

                                </Card.Body>
                            </Card>
                        </div>

                        <div className="col-lg-4 mb-4">
                            <Card className="card_main card ask_card_main text-secondary">
                                <img
                                    alt="noobmaster"
                                    className="card-img-top"
                                    src="https://images.unsplash.com/photo-1534551767192-78b8dd45b51b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
                                />

                                <Card.Body className="card-body">
                                    <Card.Title className="card-title font-weight-bold">
                                        ASK FOR HELP
                                    </Card.Title>

                                    <br />

                                    <Card.Text className="card-text">
                                        <b>
                                            Stack Overflow:404!
                                        </b>

                                        {" "}
                                        Answer not found,

                                        <br />
                                        The button below can solve it
                                    </Card.Text>

                                    <br />

                                    <Link
                                        className="col-auto btn btn-primary"
                                        to="/ask"
                                    >
                                        Ask for help
                                    </Link>
                                </Card.Body>
                            </Card>
                        </div>

                        <div className="col-lg-4 mb-4">
                            <Card className="card_main card cc_main text-secondary">
                                <img
                                    alt=""
                                    className="card-img-top"
                                    src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80"
                                />

                                <Card.Body className="card-body">
                                    <Card.Title className="card-title font-weight-bold">
                                        LET&apos;S  COLLABORATE
                                    </Card.Title>

                                    <br />

                                    <Card.Text className="card-text">
                                        Find new projects to work.
                                        Apply for teams and Collaborations.
                                        Lets keep the learning and helping community alive.
                                    </Card.Text>

                                    <div
                                        className="col-auto btn btn-primary disabled"
                                        to="/collab_connect"
                                    >
                                        Coming Soon...
                                    </div>

                                </Card.Body>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>
        </div>
        
    )    
} 

export default AuthenticatedHome