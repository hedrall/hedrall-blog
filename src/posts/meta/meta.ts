import { _PostFileName } from './filenames';
import _meta from './_meta';

export type _Meta = {
  slug: string;
  title: string;
  description?: string;
  date: string;
  author: string;
  image: string;
  tags: readonly string[];
};

export const _Meta: { [K in _PostFileName]: _Meta & { slug: _PostFileName extends `${infer N}.mdx` ? N : string } } = _meta;
