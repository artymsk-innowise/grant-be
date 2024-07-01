import {
  formattedDate,
  decodeCursor,
  encodeCursor,
  createPageInfo,
} from './helper-functions';
import { PageInfo } from '@api/grants/models/page.model';

describe('helper-functions', () => {
  describe('formattedDate', () => {
    it('should format date to MM-DD-YYYY', () => {
      const date = new Date('2024-01-01T00:00:00Z');
      const formatted = formattedDate(date);
      expect(formatted).toBe('1/1/2024');
    });
  });

  describe('decodeCursor', () => {
    it('should decode base64 cursor to number', () => {
      const cursor = Buffer.from('12345').toString('base64');
      const decoded = decodeCursor(cursor);
      expect(decoded).toBe(12345);
    });
  });

  describe('encodeCursor', () => {
    it('should encode number to base64 cursor', () => {
      const id = 12345;
      const encoded = encodeCursor(id);
      expect(encoded).toBe(Buffer.from(id.toString()).toString('base64'));
    });
  });

  describe('createPageInfo', () => {
    interface TestNode {
      id: number;
    }

    it('should create page info object', () => {
      const edges = [
        { cursor: 'cursor1', node: { id: 1 } },
        { cursor: 'cursor2', node: { id: 2 } },
      ];
      const hasNextPage = true;
      const after = 'cursor0';

      const pageInfo: PageInfo = createPageInfo(edges, hasNextPage, after);

      expect(pageInfo.endCursor).toBe('cursor2');
      expect(pageInfo.startCursor).toBe('cursor1');
      expect(pageInfo.hasNextPage).toBe(true);
      expect(pageInfo.hasPreviousPage).toBe(true);
    });

    it('should handle empty edges', () => {
      const edges = [];
      const hasNextPage = false;
      const after = 'cursor0';

      const pageInfo: PageInfo = createPageInfo(edges, hasNextPage, after);

      expect(pageInfo.endCursor).toBeNull();
      expect(pageInfo.startCursor).toBeNull();
      expect(pageInfo.hasNextPage).toBe(false);
      expect(pageInfo.hasPreviousPage).toBe(true);
    });
  });
});
