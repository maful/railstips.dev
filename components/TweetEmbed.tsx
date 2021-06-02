import { useState } from 'react'
import { Tweet } from 'react-twitter-widgets'

interface TweetEmbedProps {
  tweetId: string;
}

const TweetEmbed = (props: TweetEmbedProps): JSX.Element => {
  const [loading, setLoading] = useState(true)
  console.log(loading)

  return (
    <Tweet
            tweetId={props.tweetId}
            onLoad={() => setLoading(false)}
          />
  )
}

export default TweetEmbed
