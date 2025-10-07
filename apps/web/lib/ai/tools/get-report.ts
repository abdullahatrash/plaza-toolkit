import { tool, type UIMessageStreamWriter } from 'ai';
import { z } from 'zod';
import { reportApi } from '@workspace/lib/db-api';

interface GetReportProps {
  dataStream: UIMessageStreamWriter<any>;
}

export const getReport = ({ dataStream }: GetReportProps) =>
  tool({
    description: 'Get detailed information about a specific environmental incident report by ID or report number',
    inputSchema: z.object({
      reportId: z.string().optional().describe('The report ID (cuid)'),
      reportNumber: z.string().optional().describe('The report number (e.g., RPT-2024-001)'),
    }),
    execute: async ({ reportId, reportNumber }) => {
      if (!reportId && !reportNumber) {
        return { error: 'Either reportId or reportNumber must be provided' };
      }

      try {
        // Notify that we're fetching the report
        dataStream.write({
          type: 'data-tool-start',
          data: { tool: 'getReport', params: { reportId, reportNumber } },
          transient: true,
        });

        let report;

        if (reportNumber) {
          report = await reportApi.findByReportNumber(reportNumber);
        } else if (reportId) {
          report = await reportApi.findById(reportId);
        }

        if (!report) {
          dataStream.write({
            type: 'data-tool-error',
            data: { tool: 'getReport', error: 'Report not found' },
            transient: true,
          });
          return { error: 'Report not found' };
        }

        const result = {
          id: report.id,
          reportNumber: report.reportNumber,
          title: report.title,
          description: report.description,
          type: report.type,
          status: report.status,
          priority: report.priority,
          location: report.location,
          latitude: report.latitude,
          longitude: report.longitude,
          incidentDate: report.incidentDate,
          author: report.author?.name,
          assignee: report.assignee?.name,
          photosCount: report.photos?.length || 0,
          evidenceCount: report.evidence?.length || 0,
          tags: report.tags ? JSON.parse(report.tags) : [],
        };

        // Notify success
        dataStream.write({
          type: 'data-tool-result',
          data: { tool: 'getReport', result },
          transient: true,
        });

        return result;
      } catch (error) {
        console.error('Error fetching report:', error);
        dataStream.write({
          type: 'data-tool-error',
          data: { tool: 'getReport', error: 'Failed to fetch report' },
          transient: true,
        });
        return { error: 'Failed to fetch report' };
      }
    },
  });
