import filenames from './_filename';
export const _PostFileName = filenames;
export type _PostFileName = (typeof _PostFileName)[number];
export type FileId = _PostFileName extends `${infer ID}.mdx` ? ID : never;
