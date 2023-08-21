import fs from 'fs';
import path from 'path';

export const loadBody = (id: string) => {
  const body = fs.readFileSync(path.resolve(__dirname, `../../posts/${id}.mdx`)).toString();

  // 本文に引用を追加する
  return `
  [自ブログ](https://blog.hedrall.work/posts/${id})からの引用です。
  
  ${body}
  `;
};
