import { useEffect, useRef } from "react";

declare global {
  interface Window {
    twttr: any;
  }
}

interface Props {
  tweetId: string;
}

export default function TweetEmbed(props: Props) {
  const tweetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let ignore = false;

    if (!window.twttr) {
      console.error("Unable to load twitter js");
      return;
    }

    if (!ignore) {
      window.twttr.widgets.createTweet(props.tweetId, tweetRef.current);
    }

    return () => {
      ignore = true;
      tweetRef.current?.querySelector("div.twitter-tweet")?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div id={`tweet_${props.tweetId}`} ref={tweetRef} />
    </>
  );
}
