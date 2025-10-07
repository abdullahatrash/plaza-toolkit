import { tool, type UIMessageStreamWriter } from 'ai';
import { z } from 'zod';
import { reportApi } from '@workspace/lib/db-api';

interface SearchReportsProps {
  dataStream: UIMessageStreamWriter<any>;
}

export const searchReports = ({ dataStream }: SearchReportsProps) =>
  tool({
    description: 'Search and filter environmental incident reports by status, type, priority, location, or date range',
    inputSchema: z.object({
      status: z.string().optional().describe('Report status (e.g., SUBMITTED, UNDER_REVIEW, APPROVED)'),
      type: z.string().optional().describe('Report type (e.g., POLLUTION, WILDLIFE, WATER_QUALITY)'),
      priority: z.string().optional().describe('Priority level (LOW, MEDIUM, HIGH, CRITICAL)'),
      limit: z.number().optional().default(10).describe('Maximum number of results to return'),
    }),
    execute: async ({ status, type, priority, limit = 10 }) => {
      try {
        // Notify search started
        dataStream.write({
          type: 'data-tool-start',
          data: { tool: 'searchReports', params: { status, type, priority, limit } },
          transient: true,
        });

        const filters: any = {};

        if (status) filters.status = status;
        if (type) filters.type = type;
        if (priority) filters.priority = priority;

        const result = await reportApi.list(filters, { page: 1, limit });

        const formattedResult = {
          total: result.total,
          reports: result.reports.map(report => ({
            id: report.id,
            reportNumber: report.reportNumber,
            title: report.title,
            type: report.type,
            status: report.status,
            priority: report.priority,
            location: report.location,
            incidentDate: report.incidentDate,
            author: report.author?.name,
          }))
        };

        // Notify success
        dataStream.write({
          type: 'data-tool-result',
          data: { tool: 'searchReports', result: formattedResult },
          transient: true,
        });

        return formattedResult;
      } catch (error) {
        console.error('Error searching reports:', error);
        dataStream.write({
          type: 'data-tool-error',
          data: { tool: 'searchReports', error: 'Failed to search reports' },
          transient: true,
        });
        return { error: 'Failed to search reports' };
      }
    },
  });
