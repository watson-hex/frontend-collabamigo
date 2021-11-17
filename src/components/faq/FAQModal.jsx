
import React from "react"
// import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal"
import FaqSearch from "./faq_search";

class FAQModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            show : false,
            temp : [
                {question:"Online play and Nintendo Switch Online app",answer:"The Nintendo Switch Online service lets Nintendo Switch owners enjoy online play in compatible games like Splatoon 2, ARMS, and Mario Kart 8 Deluxe."},
                {question:"Classic Game Libraries",answer:"Members can enjoy a growing library of NES games and Super NES games with added online play as part of the paid Nintendo Switch Online membership. With the Nintendo Switch Online smartphone app, you can also voice chat during your play sessions."},
                {question:"Save Data Cloud Backup",answer:"Players with a Nintendo Switch Online membership can save game data online for compatible games. Save data is linked to your Nintendo Account, so you can access it from any Nintendo Switch system by signing in and downloading your save data."},
                {question:"Special Offers",answer:"Nintendo Switch Online members in the U.S. and Canada have access to exclusive special offers, such as the option to purchase specially designed classic game controllers for use with the classic game libraries."}]
        }
    }

    shouldComponentUpdate() {
        return true;
    }
       
    handleClose(){ this.setState({
        show: false
    })}
    
    handleShow(){ this.setState({
        show: true
    })}



    render() {
            return (
                <>
                    <Button
                        onClick={this.handleShow.bind(this)}
                        variant="primary"
                    >
                        Launch demo modal
                    </Button>

                    <Modal
                        className="w-100"
                        onHide={this.handleClose.bind(this)}
                        show={this.state.show}
                    >
                        <FaqSearch details={this.state.temp} />
                    </Modal>
                </>
            )}
}
                        
export default  FAQModal
