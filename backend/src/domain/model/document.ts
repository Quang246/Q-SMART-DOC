export class DocumentModel {
  docid: number;
  docname: string;
  author?: string;
  category?: string;
  file_path: string;
  created_by?: number;
  created_at: Date;
}
