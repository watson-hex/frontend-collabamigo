import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Image from "react-bootstrap/Image";
import axios from "utilities/axios";
import styles from "../styles/index.module.css";
import EventTalkCard from "../common/HomePageCards/EventTalkCard.js";
import ClubList from 'components/ClubList/ClubList';

// import LandingFooter from "components/LandingFooter";

export default class AuthenticatedHome extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            clubList: [],
            eventList: [],
            // talkList: [],
        };
    }

    componentDidMount() {
        axios.get("/club/feed").then((res) => {
            this.setState({
                clubList:res.data.clubs,
                eventList:res.data.competitions
            });
        })
    }

    shouldComponentUpdate() {
        return true;
    }

    render() {

        const responsive = {
                        superLargeDesktop: {
                          // the naming can be any, depends on you.
                          breakpoint: { max: 4000, min: 3000 },
                          items: 5
                        },
                        desktop: {
                          breakpoint: { max: 3000, min: 1024 },
                          items: 3
                        },
                        tablet: {
                          breakpoint: { max: 1024, min: 464 },
                          items: 2
                        },
                        mobile: {
                          breakpoint: { max: 464, min: 0 },
                          items: 2
                        }
                      };

        return (
            <div>
                <div className={styles.firstSection}>
                    <div className={styles.firstsectionInner + " row"}>
                        <div className={styles.firstsectionInnerleft}>
                            <Image
                                alt="Front Photo"
                                className={styles.firstsectionInnerleftImage}
                                fluid
                                rounded
                                src="/img/jpg/IntroImage.png"
                            />
                        </div>

                        <div className={styles.firstsectionInnerright}>
                            <span className={styles.firstsectionInnerheading + " display-2 fw-bold text-primary"}>
                                Welcome to CollabAmigo!
                            </span>

                            <br />

                            <span className={styles.firstsectionInnertext + " text-primary"}>
                                Participate in competitions in college,
                            </span>

                            <br />

                            <span className={styles.firstsectionInnertext + " text-primary"}>
                                have lots of fun!
                            </span>

                        </div>
                    </div>
                </div>

                <div className={styles.secondSection}>
                    <div className={styles.secondsectionInner}>
                        <div className={styles.secondsectionHeading + " text-primary mb-2"}>
                            Competitions
                        </div>

                        <div className={styles.secondsectionMiddle}>
                            <Carousel
                                infinite
                                responsive={responsive}
                            >

                                {this.state.eventList.map((option) => (
                                    <EventTalkCard
                                        element={option}
                                        key={option}
                                    />
                                    ))}

                            </Carousel>
                        </div>

                        <div className={styles.secondsectionfooter +" d-flex flex-row-reverse bd-highlight"}>
                            <div className="p-2 bd-highlight" />

                            <div className="p-2 bd-highlight" />
                        </div>

                    </div>
                </div>
                        
                        
                { this.state.clubList.length > 0 && <ClubList
                    ItemList={this.state.clubList}
                    text='Clubs & Organizations' 
                                                    /> }
              
            </div>

        );
    }
}

// TODO: Attribution to freepik.com pending
