import { tool, type UIMessageStreamWriter } from 'ai';
import { z } from 'zod';
import { caseApi } from '@workspace/lib/db-api';

interface SearchCasesProps {
  dataStream: UIMessageStreamWriter<any>;
}

export const searchCases = ({ dataStream }: SearchCasesProps) =>
  tool({
    description: 'Search and filter investigation cases by status, type, priority, or assigned investigator. Use this to count cases or list multiple cases.',
    inputSchema: z.object({
      status: z.string().optional().describe('Case status (e.g., OPEN, UNDER_INVESTIGATION, CLOSED)'),
      type: z.string().optional().describe('Case type (e.g., POLLUTION, WILDLIFE, WATER_QUALITY)'),
      priority: z.string().optional().describe('Priority level (LOW, MEDIUM, HIGH, CRITICAL)'),
      limit: z.number().optional().default(10).describe('Maximum number of results to return'),
    }),
    execute: async ({ status, type, priority, limit = 10 }) => {
      try {
        // Notify search started
        dataStream.write({
          type: 'data-tool-start',
          data: { tool: 'searchCases', params: { status, type, priority, limit } },
          transient: true,
        });

        const filters: any = {};

        if (status) filters.status = status;
        if (type) filters.type = type;
        if (priority) filters.priority = priority;

        const result = await caseApi.list(filters, { page: 1, limit });

        const formattedResult = {
          total: result.total,
          cases: result.cases.map(caseData => ({
            id: caseData.id,
            caseNumber: caseData.caseNumber,
            title: caseData.title,
            type: caseData.type,
            status: caseData.status,
            priority: caseData.priority,
            owner: caseData.owner?.name,
            reportsCount: caseData.reports?.length || 0,
          }))
        };

        // Notify success
        dataStream.write({
          type: 'data-tool-result',
          data: { tool: 'searchCases', result: formattedResult },
          transient: true,
        });

        return formattedResult;
      } catch (error) {
        console.error('Error searching cases:', error);
        dataStream.write({
          type: 'data-tool-error',
          data: { tool: 'searchCases', error: 'Failed to search cases' },
          transient: true,
        });
        return { error: 'Failed to search cases' };
      }
    },
  });
