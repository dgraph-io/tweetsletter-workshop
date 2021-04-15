import React from 'react';
import { TwitterTweetEmbed } from 'react-twitter-embed'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner,  faRocket } from '@fortawesome/free-solid-svg-icons'
import { useMutation, gql } from '@apollo/client'
import { DELETE_TWEET } from './consts'


export default function TweetEmbed({ tweet, authenticated, currentQuery, noMargin=false }) {
    const [deleteTweet] = useMutation(DELETE_TWEET);


    const removeTweet = async (id) => {
        await deleteTweet({
            variables: { id },
            refetchQueries: [{ query: gql(currentQuery) }]
        });
    }

    return (
        <div 
            className={"ql-tweet-wrapper mx-auto " + (noMargin? "nomargin" : "")}
            key={tweet.id}
        >
            <div className="ql-hide-tweet-outline" />
            <TwitterTweetEmbed
                tweetId={tweet.id}
                key={tweet.id}
                placeholder={
                    <div className="py-5 text-center">
                        <FontAwesomeIcon icon={faSpinner} className="fa-2x fa-spin" />
                    </div>
                }
                style={{ margin: '0!important'}}
            />

            {authenticated && 
                <div style={{ display: 'flex', justifyContent: 'space-between', background: '', padding: '8px' }}>
                    <div>
                        <button onClick={() => removeTweet(tweet.id)}>Delete</button>
                    </div>
                </div>
            }
        </div>
    )
}