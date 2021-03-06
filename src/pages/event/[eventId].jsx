/* eslint-disable react/no-array-index-key */
import lodashIsEmpty from "lodash/isEmpty";
import Head from "next/head";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react"
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import Carousel from "react-bootstrap/Carousel";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar, faClock } from '@fortawesome/free-regular-svg-icons'
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'
import FAQModal from "components/faq/FAQModal";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { useRouter } from 'next/router'
import { remark } from "remark";
import strip from "strip-markdown";
import axios from "utilities/axios";
import { SvgIcon } from "common/SvgIcon";
import WModal from 'components/WModal';
import Loading from "components/Loading";
import lodashMap from "lodash/map";
import Link from "../../common/Link";
import GenerateEventForm from "../../components/GenerateEventForm";
import ReactMarkdown from 'react-markdown'
import {
    FacebookShareButton,
    EmailShareButton,
    WhatsappShareButton,
    TwitterShareButton,
    LinkedinShareButton,
    TelegramShareButton,
} from "react-share";
import * as ga from "../../lib/ga";
import { isBrowser } from "../../utilities/auth";
import ClubEventlist from 'components/ClubEventList/ClubEventlist';

export default function Event({ eventData }) {
    const router = useRouter();

    let eventId = undefined;

    if (router.query.eventId !== undefined)
        eventId = router.query.eventId.split("-")[0];

    const [ModalShow, setModalShow] = useState(false);

    const [data, setData] = useState({
        imageLinks: [],
        clubLogoLinks: {},
        event: {},
        form: [undefined, false],
        pastResponse: [[], false],
    });

    const [analyticLogged, setAnalyticLogged] = useState(false);


    const handleClose = () => setModalShow(false);
    const handleShow = () => setModalShow(true);

    const setEvent = (event) => {
        setData((prevData) => {
            return {
                ...prevData,
                bannerPaths: event.image_links,
                event: {
                    ...prevData.event,
                    ...event,
                }
            };
        });
    };

    const setForm = (form) => setData((prevData) => {
        return { ...prevData, form: [form, true] }
    });

    const addClubLogoLinks = (club, link) => {
        setData((prevData) => {
            return { ...prevData, clubLogoLinks: { ...(prevData.clubLogoLinks), [club]: link } }
        })
    };

    useEffect(() => {
        if (!analyticLogged && isBrowser()) {
            ga.event({
                action: `event-${eventData.id}-page-viewed`,
                params: {
                    event_id: eventData.id,
                }
            });
            setAnalyticLogged(true);
        }
    })

    const event = data.event;
    const form = data.form[0];
    const clubLogoLinks = data.clubLogoLinks;
    const imageLinks = data.bannerLinks;

    if (lodashIsEmpty(event) && !lodashIsEmpty(eventData)) {
        setEvent(eventData);
        if ((eventData.winners !== undefined)) {
            setModalShow(true);
        }
    }

    const convertToDatetimeString = iso_8601_string => {
        const date = new Date(iso_8601_string);
        return date.toLocaleString();
    }

    useEffect(() => {
        if (eventId !== undefined) {
            if (lodashIsEmpty(event))
                axios.get(`club/competition/${eventId}/`)
                    .then(res => {
                        setEvent(res.data)
                        if ((res.data.winners !== undefined)) {
                            setModalShow(true);
                        }
                    })

            if (!data.form[1])
                axios.get(`form/form/${eventId}/`)
                    .then(res => setForm(res.data))
                    .catch(err => {
                        if (err.response.status === 404)
                            setForm(-1);
                        else
                            throw err;
                    })

            if (lodashIsEmpty(clubLogoLinks) && !lodashIsEmpty(event)) {
                const storage = getStorage();
                event.clubs.map(club => getDownloadURL(ref(storage, 'data/' + club + '/uneditable/logo.png'))
                    .then(url => addClubLogoLinks(club, url)))
            }

            if (data.bannerLinks === undefined && data.bannerPaths !== undefined) {
                const storage = getStorage();
                if (data.bannerPaths === '[]') {
                    // suppression needed
                    // eslint-disable-next-line react/no-did-update-set-state
                    setData({ ...data, bannerLinks: [] })
                } else
                    JSON.parse(data.bannerPaths).map((link, index) => {
                        getDownloadURL(ref(storage, link)).then((url) => {
                            // alert("adding "+url+" at "+index)
                            setData((data) => ({
                                ...data,
                                bannerLinks: {
                                    ...(data.bannerLinks),
                                    [index]: url,
                                }
                            })
                            )
                        })
                    })
            }

            if (!data.pastResponse[1]) {
                axios.get(`form/get-response/${eventId}/`)
                    .then(res => setData((prevData) => {
                        if (lodashIsEmpty(res.data))
                            return { ...prevData, pastResponse: [[], true] }

                        let response = res.data[0].elements;
                        let temp_holder = {};
                        response.forEach(element => {
                            temp_holder[element.question] = element.value;
                        });
                        return { ...prevData, pastResponse: [temp_holder, true] }
                    }))
                    .catch(() => {
                        setData((prevData) => {
                            return { ...prevData, pastResponse: [[], true] }
                        })
                    })
            }

        }
    })
    const isLoading = lodashIsEmpty(event);

    // const ref = useRef()
    // const isParticipateButtonVisible = useOnScreen(ref)

    let url;
    if (isBrowser())
        url = window.location.href
    else
        url = "https://collabamigo.com/event/" + eventId

    if (isLoading)
        return <Loading />
    return (
        <>
            <Head>
                <title>
                    {event.name}
                </title>

                <meta
                    content={event.description}
                    name="description"
                />

                <meta
                    content={`CollabAmigo - ${event.name}`}
                    property="og:title"
                />

                <meta
                    content={event.strippedDescription}
                    property="og:description"
                />

                <meta
                    content={event.graph_link}
                    property="og:image"
                />

                <meta
                    content={url}
                    property="og:url"
                />
            </Head>

            <WModal
                ModalShow={ModalShow}
                handleClose={handleClose}
                handleShow={handleShow}
                values={lodashIsEmpty(event.winners) ? null : event.winners}
            />

            <div className="row px-md-5 mx-md-5 px-2 mx-2">
                <div className="col-md-4 col-12 me-4 mt-lg-4">
                    <div className="pb-5">
                        {imageLinks ?
                            <Carousel>
                                {lodashMap(imageLinks, (image, index) => {
                                    return (
                                        <Carousel.Item key={index}>
                                            <Image
                                                alt={event.name}
                                                fluid
                                                rounded
                                                src={image}
                                            />
                                        </Carousel.Item>
                                    )
                                })}
                            </Carousel>
                            : null}
                    </div>

                    <div className="pt-4">
                        <p className="text-center text-primary fs-4">
                            Organised By
                        </p>

                        <div className="row justify-content-around">
                            {lodashMap(clubLogoLinks, ((link, club) => {
                                return (
                                    <div
                                        className="col-5 me-1"
                                        key={club + link}
                                    >
                                        <Image
                                            alt={club}
                                            fluid
                                            rounded
                                            src={link}
                                            thumbnail
                                        />
                                    </div>
                                )
                            }))}
                        </div>
                    </div>
                </div>


                <div className="col">
                    <div className="row">
                        <div className="col-md-9 col-12">

                            <br />

                            <h1 className="fw-bold  text-primary">
                                {event.name}
                            </h1>

                            <br />

                            <div>

                                <div className="">

                                    <p className=" text-primary">
                                        <SvgIcon
                                            className={{ Fill: 'blue' }}
                                            height="20px"
                                            src="organization.svg"
                                            width="20px"
                                        />

                                        {' '}

                                        {data.event.club_names.map((item, index) => (
                                            <span key={item}>
                                                {item}

                                                {(index + 1 !== data.event.club_names.length) ? ", " : null}

                                                {' '}
                                            </span>
                                        ))}
                                    </p>

                                    <p className=" text-primary">

                                        <FontAwesomeIcon icon={faCalendar} />

                                        {' '}

                                        {convertToDatetimeString(event.event_start) +
                                            (event.event_end ? " to " + convertToDatetimeString(event.event_end) : "")}
                                    </p>


                                    {event.location ?
                                        <p className=" text-primary">
                                            <FontAwesomeIcon icon={faMapMarkerAlt} />

                                            {" "}

                                            {event.location}
                                        </p> : null}

                                    {lodashIsEmpty(form) ? null :
                                    <p className=" text-primary">
                                        <FontAwesomeIcon icon={faClock} />

                                        {' '}

                                        Reg. starts
                                        {' '}

                                        {convertToDatetimeString(form.opens_at)}

                                        {convertToDatetimeString(form.closes_at) ? ", closes " + convertToDatetimeString(form.closes_at) : ""}
                                    </p>}

                                    <div>
                                        <ReactMarkdown>
                                            {event.description}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-3 col-12">
                            <div className="row">
                                {lodashIsEmpty(form) ? null :
                                <div className="col-12 p-2">
                                    <GenerateEventForm
                                        end={form.closes_at}
                                        eventId={eventId}
                                        formData={JSON.parse(form.skeleton)}
                                        registerUrlQuery={router.query.register || false}
                                        response={data.pastResponse[0]}
                                        start={form.opens_at}
                                    />
                                </div>}

                                {(!event.faq || lodashIsEmpty(JSON.parse(event.faq))) ? null :
                                <div className="p-2 col-6">
                                    <FAQModal data={JSON.parse(event.faq)} />
                                </div>}

                                <div className="p-2 col-6">
                                    {event.link && (
                                        <Button
                                            // className={"w-100 "+ (((new Date()) > (new Date(form.closes_at))) && ((new Date()) < (new Date(form.starts_at))) ?"disabled":"")}
                                            className="w-100 "
                                            // disabled={((new Date()) > (new Date(form.closes_at))) ? true : false}
                                            href={event.link}
                                            rel="noopener noreferrer"
                                            target="_blank"
                                            variant="outline-primary"
                                        >
                                            {() => alert(event.link)}
                                            Join meet
                                        </Button>)}
                                </div>
                            </div>

                            <Link to="/history">
                                <div className="small text-end w-100">
                                    See previous entries
                                </div>

                            </Link>

                            <div className="d-flex justify-content-around mt-2 mb-5 mb-md-4">
                                <FacebookShareButton
                                    quote={event.promotional_message.replace("<<link>>", url)}
                                    url={url}
                                >
                                    <SvgIcon
                                        height="20px"
                                        src="facebook.svg"
                                        width="20px"
                                    />
                                </FacebookShareButton>

                                <EmailShareButton
                                    body={event.promotional_message.replace("<<link>>", url)}
                                    subject={event.name}
                                    url={url}
                                >
                                    <SvgIcon
                                        height="20px"
                                        src="mail.svg"
                                        width="20px"
                                    />
                                </EmailShareButton>

                                <WhatsappShareButton
                                    title={event.promotional_message.replace("<<link>>", url)}
                                    url={url}
                                >
                                    <SvgIcon
                                        height="20px"
                                        src="whatsapp.svg"
                                        width="20px"
                                    />
                                </WhatsappShareButton>

                                <TwitterShareButton
                                    title={event.name}
                                    url={url}
                                >
                                    <SvgIcon
                                        height="20px"
                                        src="twitter.svg"
                                        width="20px"
                                    />
                                </TwitterShareButton>


                                <TelegramShareButton
                                    title={event.promotional_message.replace("<<link>>", url)}
                                    url={url}
                                >
                                    <SvgIcon
                                        height="20px"
                                        src="telegram.svg"
                                        width="20px"
                                    />
                                </TelegramShareButton>

                                <LinkedinShareButton
                                    summary={event.promotional_message.replace("<<link>>", url)}
                                    title={event.name}
                                    url={url}
                                >
                                    <SvgIcon
                                        height="20px"
                                        src="linkedin.svg"
                                        width="20px"
                                    />
                                </LinkedinShareButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='my-5'>
                <ClubEventlist
                    openInNewTab
                    text='You may also like'
                />
            </div>
        </>
    )
}

export async function getServerSideProps(context) {
    const eventId = context.query.eventId.split("-")[0]
    const res = await axios.get(`club/competition/${eventId}/`)

    // const res = await fetch(`https://...`)
    // const data = await res.
    //
    if (!res) {
        return {
            eventData: [],
        }
    }

    const strippedDescription = String(await remark()
        .use(strip)
        .process(res.data.description)).substring(0, 200)

    // console.log(res.data)
    return {
        props: { eventData: { ...(res.data), strippedDescription } }, // will be passed to the page component as props
    }
}

Event.propTypes = {
    eventData: PropTypes.objectOf(PropTypes.string).isRequired,
}
