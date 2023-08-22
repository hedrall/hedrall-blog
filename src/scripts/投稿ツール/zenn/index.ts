import { ExternalSiteSettings } from '../../../posts/meta/externalSiteSettings';
import { ZennPosted } from './posted';
import { FileId } from '../../../posts/meta/filenames';
import { build } from './build';

(async () => {
  const fileIds = [...Object.values(ZennPosted.items).map((i) => i.fileId), ...Object.keys(ExternalSiteSettings)] as FileId[];
  for (const id of fileIds) {
    console.log(`>>> id: ${id}`);
    await build(id);
  }
})().catch(console.error);
