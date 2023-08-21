import { _PostFileName } from './filenames';
import { _Meta } from './meta';
import { _PostComponents } from './components';

export namespace Post {
  export const Meta = _Meta;
  export type Meta = _Meta;

  export const FileNames = _PostFileName;
  export type FileName = _PostFileName;

  export const Components = _PostComponents;
}
