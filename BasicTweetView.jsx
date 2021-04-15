import React, { useState, useEffect } from 'react'
import { gql, useQuery } from '@apollo/client'
import { Row, Col, Navbar, Form, Container } from 'react-bootstrap'
import Logo from "./assets/images/logo.png"

import 'bootstrap/dist/css/bootstrap.min.css';
import TweetEmbed from './TweetEmbed';

export const TWEET_QUERY = `
{
    queryTweets {
        id
        text
    }
}
`.trim();

export const SEARCH_FILTER = `text: { alloftext: "$searchTerms" }`;

export const SORT_OPTIONS = [
    { key: "Newest", by: "timestamp", order: "desc" },
    { key: "Oldest", by: "timestamp", order: "asc" },
]


export default function BasicTweetView({ authenticated, onKeyChange }) {
    const NUMBER_OF_COLUMNS = window.matchMedia('(max-width: 992px)').matches? 1 : 3;

    const [sortIndex, setSortIndex] = useState(0);
    const [numberOfTweetsToShow, setNumberOfTweetsToShow] = useState(10);
    const [searchValue, setSearchValue] = useState("");
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [adminMode, setAdminMode] = useState(false);

    const generateFilters = () => {
        const baseFilter = `, filter: { and: {
            $filters
        }}`;

        let filters = [];

        if (searchValue) {
            filters.push(SEARCH_FILTER.replace('$searchTerms', searchValue));
        }

        return filters? baseFilter.replace('$filters', filters.join(',')) : "";
    };

    const replaceSortVars = query => {
        return query
                .replace('$sortOrder', SORT_OPTIONS[sortIndex].order)
                .replace('$sortField', SORT_OPTIONS[sortIndex].by);
    }

    const generateQuery = () => {
        return TWEET_QUERY; //replaceSortVars(TWEET_QUERY).replace("$filters", generateFilters());
    }

    const resetFeed = () => {
        if (numberOfTweetsToShow > 10) {
            setNumberOfTweetsToShow(10);
        }
    }

    useEffect(resetFeed, [generateQuery()])

    const autoloadTweets = () => {
        window.addEventListener('scroll', () => {
            setShowMobileMenu(false);

            if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
                setNumberOfTweetsToShow(n => n + 10)
            }
        })
    }
    useEffect(autoloadTweets, [null]);

    const { data } = useQuery(gql(generateQuery()));

    const getTweets = () => {
        return data.queryTweets;
    }

    return (
        <>

        <Navbar style={{backgroundColor: '#061A36'}} variant="dark" className="p-0" expand="lg">
            <div className="d-flex w-100">
                <div className="p-2 ml-3 my-3 mr-3" style={{ background: '#E535AB', borderRadius: '50%' }}>
                    <img src={Logo} style={{ height: '30px'}} />
                </div>

                <div className=" align-self-center text-white">
                    <div className="h4 mb-0">GraphQL Tweetletter</div>
                    <div className="d-none d-lg-block">A collection of the most interesting and popular tweets, delivered to your inbox every week.</div>

                    <div className="d-flex d-block d-lg-none pt-1" title="Powered by Slash GraphQL" alt="Powered by Slash GraphQL" style={{ cursor: 'pointer' }} onClick={() => window.open('https://dgraph.io/slash')}>
                        <div className="align-self-center text-white mb-0 pr-1">Powered by</div>
                        <div>
                            <img style={{ height: '24px' }} src="https://dgraph.io/assets/images/graphql-logo.svg" />
                        </div>
                    </div>
                </div>

                <div className="flex-fill text-right align-self-center p-3">
                    <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setShowMobileMenu(!showMobileMenu)} />
                        <Navbar.Collapse id="basic-navbar-nav" >


                    </Navbar.Collapse>
                </div>

                <div className="align-self-center d-none d-lg-block pr-3" title="Powered by Slash GraphQL" alt="Powered by Slash GraphQL">
                    <div className="d-flex  justify-content-end" style={{ cursor: 'pointer' }} onClick={() => window.open('https://dgraph.io/slash')}>
                        <div className="align-self-center text-white h5 mb-0 pr-1">Powered by</div>
                        <div>
                            <img style={{ height: '36px' }} src="https://dgraph.io/assets/images/graphql-logo.svg" />
                        </div>
                    </div>
                </div>

            </div>

            <div className="d-lg-none text-left text-white px-3" style={{ position: 'fixed', left: 0, right: 0, top: '78px', bottom: 0, zIndex: '99', background: '#061A36', transform: `scaleY(${showMobileMenu? 1 : 0})`, transition: 'transform 0.5s', transformOrigin: 'top' }} >
                <div className="px-2 pb-3">
                    <div style={{ borderTop: '2px white solid'}} />
                </div>
            </div>



        </Navbar>

        <Container fluid className="px-4 px-xl-5">
            <Row className="pt-4">

                <Col xs="12" lg="12" className="px-3">
                    <div className="pb-2">
                        <Form.Control
                            placeholder="Enter admin key here"
                            onChange={e => onKeyChange(e.target.value)}
                        />
                    </div>

                    <div className="d-flex flex-wrap pb-3">
                        <div className="pr-2 pb-2" style={{ flexBasis: '200px'}}>
                            <Form.Control
                                as="select"
                                value={sortIndex}
                                onChange={e => setSortIndex(e.target.value)}
                            >
                                {SORT_OPTIONS.map((opt,index) => (
                                    <option
                                        value={index}
                                        key={opt.key}
                                    >
                                        {opt.key}
                                    </option>
                                ))}
                            </Form.Control>
                        </div>

                        <div className="flex-fill pb-2">
                            <Form.Control
                                placeholder="Search tweets..."
                                value={searchValue}
                                onChange={e => setSearchValue(e.target.value)}
                                className="flex-grow-1"
                            />
                        </div>
                    </div>

                    <Row>
                        {data &&
                            [... new Array(NUMBER_OF_COLUMNS)]
                                .map((_,col) =>
                                    <Col xs="12" xl={12/NUMBER_OF_COLUMNS} >
                                        {getTweets()
                                            .filter((_,i) => i % NUMBER_OF_COLUMNS == col)
                                            .slice(0, numberOfTweetsToShow / NUMBER_OF_COLUMNS)
                                            .map(tweet => (
                                                <TweetEmbed 
                                                    tweet={tweet}
                                                    authenticated={authenticated}
                                                    currentQuery={generateQuery()}
                                                />
                                            ))
                                        }
                                    </Col>
                                )
                            }
                    </Row>

                    {data && numberOfTweetsToShow >= getTweets().length &&
                        <div className="text-center">
                            <div className="dropdown-divider" />
                            <h6 className="font-weight-bold mt-3">The End</h6>
                        </div>
                    }
                </Col>

            </Row>
        </Container>
    </>
    )
}