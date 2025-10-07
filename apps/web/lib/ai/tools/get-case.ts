import { tool, type UIMessageStreamWriter } from 'ai';
import { z } from 'zod';
import { caseApi } from '@workspace/lib/db-api';

interface GetCaseProps {
  dataStream: UIMessageStreamWriter<any>;
}

export const getCase = ({ dataStream }: GetCaseProps) =>
  tool({
    description: 'Get detailed information about a specific investigation case by ID or case number',
    inputSchema: z.object({
      caseId: z.string().optional().describe('The case ID (cuid)'),
      caseNumber: z.string().optional().describe('The case number (e.g., CASE-2024-001)'),
    }),
    execute: async ({ caseId, caseNumber }) => {
      console.log('🔍 getCase tool called with:', { caseId, caseNumber });

      if (!caseId && !caseNumber) {
        console.log('❌ getCase: No ID or case number provided');
        return { error: 'Either caseId or caseNumber must be provided' };
      }

      try {
        // Notify that we're fetching the case
        dataStream.write({
          type: 'data-tool-start',
          data: { tool: 'getCase', params: { caseId, caseNumber } },
          transient: true,
        });

        console.log('🔎 getCase: Querying database...');
        let caseData;

        if (caseNumber) {
          console.log('🔎 getCase: Looking up by caseNumber:', caseNumber);
          caseData = await caseApi.findByCaseNumber(caseNumber);
        } else if (caseId) {
          console.log('🔎 getCase: Looking up by caseId:', caseId);
          caseData = await caseApi.findById(caseId);
        }

        console.log('📦 getCase: Query result:', caseData ? 'Found' : 'Not found');

        if (!caseData) {
          console.log('❌ getCase: Case not found');
          dataStream.write({
            type: 'data-tool-error',
            data: { tool: 'getCase', error: 'Case not found' },
            transient: true,
          });
          return { error: 'Case not found' };
        }

        const result = {
          id: caseData.id,
          caseNumber: caseData.caseNumber,
          title: caseData.title,
          description: caseData.description,
          status: caseData.status,
          priority: caseData.priority,
          type: caseData.type,
          owner: caseData.owner?.name,
          reportsCount: caseData.reports?.length || 0,
          evidenceCount: caseData.evidence?.length || 0,
          summary: caseData.summary,
          findings: caseData.findings ? JSON.parse(caseData.findings) : null,
        };

        console.log('✅ getCase: Returning result:', result);

        // Notify success
        dataStream.write({
          type: 'data-tool-result',
          data: { tool: 'getCase', result },
          transient: true,
        });

        return result;
      } catch (error) {
        console.error('Error fetching case:', error);
        dataStream.write({
          type: 'data-tool-error',
          data: { tool: 'getCase', error: 'Failed to fetch case' },
          transient: true,
        });
        return { error: 'Failed to fetch case' };
      }
    },
  });
