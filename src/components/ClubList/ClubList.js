import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from 'react-bootstrap/Button';
import Boxes from './Boxes.js';

export default class Clublist extends Component {
    static propTypes = {
        clubList: PropTypes.arrayOf(PropTypes.string).isRequired,
    }
    constructor(props) {
        super(props)
        this.state = {
            
            next:3,
            arrayForHoldingboxes : [],
            boxesPerPage: 3
        }
        this.loopWithSlice = this.loopWithSlice.bind(this);
        this.handleShowMoreboxes = this.handleShowMoreboxes.bind(this);
    }

    componentDidMount() {
        this.loopWithSlice(0, this.state.boxesPerPage);
    }

    shouldComponentUpdate()
    {return true;}

    loopWithSlice(start, end){

        this.setState((prevState) => ({ 
            arrayForHoldingboxes: prevState.arrayForHoldingboxes.concat(this.props.clubList.slice(start, end)) }))
        
        // this.setState((prevState) => ({ boxesToShow: prevState.arrayForHoldingboxes }))

        // this.setState({arrayForHoldingboxes:this.state.arrayForHoldingboxes.concat(this.props.clubList.slice(start, end))})
        // this.setState({boxesToShow:this.state.arrayForHoldingboxes})
      }


    handleShowMoreboxes(){
        this.setState((prevState) => ({ next: prevState.next + prevState.boxesPerPage }))

        this.loopWithSlice(this.state.next, this.state.next + this.state.boxesPerPage);
        // this.setState({next:this.state.next + this.state.boxesPerPage});
    }


    render() {
        console.log(this.props.clubList, "ewww")
        return (
            <div>
                {this.props.clubList.length>0 ?
                    <Boxes boxesToRender={this.state.arrayForHoldingboxes} />
                    : null}

                <Button onClick={this.handleShowMoreboxes}>
                    Load more
                </Button>
            </div>
        )
    }
}