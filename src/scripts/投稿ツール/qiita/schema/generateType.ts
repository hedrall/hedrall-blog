import { compile } from 'json-schema-to-typescript';
import fs from 'fs';
import path from 'path';

const 投稿 = require('./schema.json')['properties']['item']['links'];
const getSchema = (path: string, method: string) =>
  投稿.find((i) => {
    return i.href === path && i.method === method;
  })!.schema;

// ファイル変換
compile(getSchema('/api/v2/items', 'POST'), 'PostItemParams').then((ts) => fs.writeFileSync(path.resolve(__dirname, './postItemParams.ts'), ts));
