import Head from 'next/head';
import React from 'react';
import styles from '../../public/styles/content.module.css';
import Author from '../components/Author';
import Copyright from '../components/Copyright';
import DateComponent from '../components/Date';
import Layout from '../components/Layout';
import BasicMeta from '../components/meta/BasicMeta';
import JsonLdMeta from '../components/meta/JsonLdMeta';
import OpenGraphMeta from '../components/meta/OpenGraphMeta';
import TwitterCardMeta from '../components/meta/TwitterCardMeta';
import { SocialList } from '../components/SocialList';
import TagButton from '../components/TagButton';
import { getAuthor } from '../lib/authors';
import { getTag } from '../lib/tags';
import { Post } from '../posts/meta';

type Props = Post.Meta;
export default function MdxLayout({ title, date: _date, slug, author, tags, description, image }: Props) {
  const date = new Date(_date);
  const keywords = tags.map((it) => {
    let foundTag = getTag(it);
    return foundTag.name;
  });
  const authorName = getAuthor(author).name;
  // eslint-disable-next-line
  return ({ children: content }) => {
    return (
      <Layout>
        <BasicMeta url={`/posts/${slug}`} title={title} keywords={keywords} description={description} />
        <TwitterCardMeta url={`/posts/${slug}`} title={title} description={description} />
        <OpenGraphMeta url={`/posts/${slug}`} title={title} description={description} image={image} />
        <JsonLdMeta url={`/posts/${slug}`} title={title} keywords={keywords} date={date} author={authorName} description={description} />
        <div className={'container'}>
          <article>
            <header>
              <h1>{title}</h1>
              <div className={'metadata'}>
                <div>
                  <DateComponent date={date} />
                </div>
                <div>
                  <Author author={getAuthor(author)} />
                </div>
              </div>
            </header>
            <div className={styles.content}>{content}</div>
            <ul className={'tag-list'}>
              {tags.map((it, i) => (
                <li key={i}>
                  <TagButton tag={getTag(it)} />
                </li>
              ))}
            </ul>
          </article>
          <footer>
            <div className={'social-list'}>
              <SocialList />
            </div>
            <Copyright />
          </footer>
        </div>
        <style jsx>
          {`
            code {
              color: white;
            }
            .container {
              display: block;
              max-width: 56rem;
              width: 100%;
              margin: 0 auto;
              padding: 0 1.5rem;
              box-sizing: border-box;
            }

            .metadata div {
              display: inline-block;
              margin-right: 0.5rem;
            }
            article {
              flex: 1 0 auto;
            }
            h1 {
              margin: 0 0 0.5rem;
              font-size: 2.25rem;
            }
            .tag-list {
              list-style: none;
              text-align: right;
              margin: 1.75rem 0 0 0;
              padding: 0;
            }
            .tag-list li {
              display: inline-block;
              margin-left: 0.5rem;
            }
            .social-list {
              margin-top: 3rem;
              text-align: center;
            }

            @media (min-width: 769px) {
              .container {
                display: flex;
                flex-direction: column;
              }
            }
          `}
        </style>
        <style global jsx>
          {`
            strong {
              font-size: 110%;
              font-family: sans-serif;
              font-weight: bold;
              color: #db20a2;
            }

            /* Syntax highlighting */
            .token.comment,
            .token.prolog,
            .token.doctype,
            .token.cdata,
            .token.plain-text {
              color: #abbacb;
            }

            .token.atrule,
            .token.attr-value,
            .token.keyword {
              color: #ffa251;
            }

            .token.operator,
            .token.punctuation {
              color: white;
            }

            .token.property,
            .token.tag,
            .token.boolean,
            .token.number,
            .token.constant,
            .token.symbol,
            .token.deleted {
              color: #d9a9f3;
            }

            .token.selector,
            .token.attr-name,
            .token.string,
            .token.char,
            .token.builtin,
            .token.inserted {
              // like JB
              color: #abdb8f;
            }

            .token.function,
            .token.class-name {
              color: #ffc66d;
            }

            /* language-specific */

            /* typescript */
            .token.operator,
            .token.punctuation {
              color: white;
            }

            [class^='language-typescript'] code {
              color: white;
            }

            /* JSX */
            .language-jsx .token.punctuation,
            .language-jsx .token.tag .token.punctuation,
            .language-jsx .token.tag .token.script,
            .language-jsx .token.plain-text {
              color: #24292e;
            }

            .language-jsx .token.tag .token.attr-name {
              color: #6f42c1;
            }

            .language-jsx .token.tag .token.class-name {
              color: #005cc5;
            }

            .language-jsx .token.tag .token.script-punctuation,
            .language-jsx .token.attr-value .token.punctuation:first-child {
              color: #d73a49;
            }

            .language-jsx .token.attr-value {
              color: #032f62;
            }

            .language-jsx span[class='comment'] {
              color: pink;
            }

            /* JavaScript*/
            .language-javascript {
              color: #d9a9f3;
            }

            /* HTML */
            .language-html .token.tag .token.punctuation,
            .language-html .token.tag {
              color: #ffc66d;
            }
            .language-html,
            .language-html .token.tag .token.attr-name,
            .language-html .token.selector {
              color: white !important;
            }
            .language-html .token.tag .token.attr-value,
            .language-html .token.tag .token.attr-value .token.punctuation {
              color: #abdb8f !important;
            }

            .language-html .token.tag .token.attr-name {
              color: #6f42c1;
            }

            .language-html .token.tag .token.attr-value,
            .language-html .token.tag .token.attr-value .token.punctuation:not(:first-child) {
              color: #032f62;
            }

            /* CSS */
            .language-css .token.selector {
              color: #6f42c1;
            }

            .language-css .token.property {
              color: #005cc5;
            }
          `}
        </style>
      </Layout>
    );
  };
}
