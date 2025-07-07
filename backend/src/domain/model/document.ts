export class DocumentModel {
  documentId: number;
  title: string;
  author?: string | null;
  categoryId: number;
  filePath?: string | null;
  createdBy?: number | null;
  createdAt?: Date;
}
