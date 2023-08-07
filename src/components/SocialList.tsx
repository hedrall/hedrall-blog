import React from 'react';
import Twitter from '../assets/twitter-alt.svg';
import GitHub from '../assets/github-alt.svg';
import config from '../lib/config';
import Image from 'next/image';

export function SocialList({}) {
  return (
    <div>
      <a title="Twitter" href={`https://twitter.com/${config.twitter_account}`} target="_blank" rel="noopener">
        <Image src={Twitter} width={24} height={24} alt={'Twitter Icon'} />
      </a>
      <a title="GitHub" href={`https://github.com/${config.github_account}`} target="_blank" rel="noopener">
        <Image src={GitHub} width={24} height={24} alt={'GitHub Icon'} />
      </a>
      <style jsx>{`
        a {
          display: inline-block;
        }
        a:not(:last-child) {
          margin-right: 2em;
        }
      `}</style>
    </div>
  );
}
