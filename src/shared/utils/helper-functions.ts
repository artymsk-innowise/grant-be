import { PageInfo } from '@api/grants/models/page.model';

// Converting date to MM-DD-YYYY format
export const formattedDate = (date): string => {
  return new Date(date).toLocaleDateString('en-US');
};

export const decodeCursor = (cursor: string): number => {
  return parseInt(Buffer.from(cursor, 'base64').toString('ascii'), 10);
};
export const encodeCursor = (id: number): string => {
  return Buffer.from(id.toString()).toString('base64');
};

interface Edge<T> {
  cursor: string;
  node: T;
}

export const createPageInfo = <T>(
  edges: Edge<T>[],
  hasNextPage: boolean,
  after?: string,
): PageInfo => {
  return {
    endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
    startCursor: edges.length > 0 ? edges[0].cursor : null,
    hasNextPage,
    hasPreviousPage: !!after,
  };
};
