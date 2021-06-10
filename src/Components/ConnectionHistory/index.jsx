
import React from "react";
import './index.css';
import axios from "axios";
import backend from "../../env";
import {Card} from "react-bootstrap";
import CardExplorer from "../CardExplorer";


class ConnectionHistory extends React.Component {

    constructor (props) {

        super(props);
        this.state = {
            list:[],
            loading: true
        }
    }

    componentDidMount() {
        this.getTeacherIds();
    }

    // Noinspection JSCheckFunctionSignatures
    shouldComponentUpdate () {
        return true;
    }



    getTeacherIds = () => {
        axios.get(backend+"connect/approvals/" ,{
        params: {
            format: "json",
        }
          })
            .then((res) =>
                this.setState({list:res.data, loading: false}))
    };

    renderCardsIfNeeded() {
            return (
                <CardExplorer
                    isLoading={this.state.loading}
                    parentList={this.state.list}
                    showVotingAll
                />
            )
        }

    render () {
        if (this.state.loading)
            return (
                <>
                    <h1 className="col-sm-5 col-md-5">
                        {" "}
                        My Connection History

                        {" "}
                    </h1>

                    <div
                        className="spinner-border"
                        role="status"
                    >
                        <span className="sr-only">
                            Loading...
                        </span>
                    </div>
                </>
            )
        else
              return (
                  <div>
                      <Card className="card card_skillSearch">
                          <Card.Title>
                              <h1 className="col-sm-5 col-md-5">
                                  {" "}
                                  My Connection History

                                  {" "}
                              </h1>
                          </Card.Title>

                          <Card.Body>
                              <div className="row-auto pt-5">
                                  <div className="col-auto pl-lg-5">
                                      {this.renderCardsIfNeeded()}
                                  </div>
                              </div>


                          </Card.Body>
                      </Card>
                  </div>
              );

          }
}

export default ConnectionHistory;