"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { FileText, FolderOpen, Search, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Button } from "@workspace/ui/components/button";

interface ToolCallPart {
  type: "tool-call";
  toolCallId: string;
  toolName: string;
  args: Record<string, any>;
}

interface ToolResultPart {
  type: "tool-result";
  toolCallId: string;
  toolName: string;
  result: any;
}

interface ChatArtifactProps {
  part: ToolCallPart | ToolResultPart;
}

export function ChatArtifact({ part }: ChatArtifactProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (part.type === "tool-call") {
    return (
      <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/30">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900">
                {getToolIcon(part.toolName)}
                <span className="ml-1 text-xs">{getToolLabel(part.toolName)}</span>
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-6 px-2"
            >
              {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </Button>
          </div>
        </CardHeader>
        {isExpanded && (
          <CardContent className="pt-0">
            <div className="text-xs text-muted-foreground">
              <pre className="rounded bg-muted p-2 overflow-x-auto">
                {JSON.stringify(part.args, null, 2)}
              </pre>
            </div>
          </CardContent>
        )}
      </Card>
    );
  }

  // tool-result
  return (
    <Card className="border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-100 dark:bg-green-900">
              {getToolIcon(part.toolName)}
              <span className="ml-1 text-xs">{getToolLabel(part.toolName)} Result</span>
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-6 px-2"
          >
            {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </Button>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent className="pt-0">
          {renderToolResult(part.toolName, part.result)}
        </CardContent>
      )}
    </Card>
  );
}

function getToolIcon(toolName: string) {
  switch (toolName) {
    case "getReport":
      return <FileText className="h-3 w-3" />;
    case "getCase":
      return <FolderOpen className="h-3 w-3" />;
    case "searchReports":
      return <Search className="h-3 w-3" />;
    default:
      return <FileText className="h-3 w-3" />;
  }
}

function getToolLabel(toolName: string): string {
  switch (toolName) {
    case "getReport":
      return "Get Report";
    case "getCase":
      return "Get Case";
    case "searchReports":
      return "Search Reports";
    default:
      return toolName;
  }
}

function renderToolResult(toolName: string, result: any) {
  if (!result) {
    return <p className="text-sm text-muted-foreground">No result</p>;
  }

  // Handle error results
  if (typeof result === "string" && result.startsWith("Error:")) {
    return <p className="text-sm text-destructive">{result}</p>;
  }

  switch (toolName) {
    case "getReport":
      return <ReportResult report={result} />;
    case "getCase":
      return <CaseResult case_={result} />;
    case "searchReports":
      return <SearchResults results={result} />;
    default:
      return (
        <pre className="text-xs overflow-x-auto rounded bg-muted p-2">
          {JSON.stringify(result, null, 2)}
        </pre>
      );
  }
}

function ReportResult({ report }: { report: any }) {
  if (!report) return <p className="text-sm text-muted-foreground">Report not found</p>;

  return (
    <div className="space-y-2 text-sm">
      <div>
        <span className="font-semibold">Report #{report.reportNumber}</span>
        <Badge className="ml-2" variant="secondary">
          {report.status}
        </Badge>
      </div>
      <p className="font-medium">{report.title}</p>
      <p className="text-muted-foreground">{report.description}</p>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-muted-foreground">Type:</span> {report.type}
        </div>
        <div>
          <span className="text-muted-foreground">Priority:</span> {report.priority}
        </div>
        <div>
          <span className="text-muted-foreground">Location:</span> {report.location}
        </div>
        <div>
          <span className="text-muted-foreground">Incident Date:</span>{" "}
          {new Date(report.incidentDate).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}

function CaseResult({ case_ }: { case_: any }) {
  if (!case_) return <p className="text-sm text-muted-foreground">Case not found</p>;

  return (
    <div className="space-y-2 text-sm">
      <div>
        <span className="font-semibold">Case #{case_.caseNumber}</span>
        <Badge className="ml-2" variant="secondary">
          {case_.status}
        </Badge>
      </div>
      <p className="font-medium">{case_.title}</p>
      <p className="text-muted-foreground">{case_.description}</p>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-muted-foreground">Type:</span> {case_.type}
        </div>
        <div>
          <span className="text-muted-foreground">Priority:</span> {case_.priority}
        </div>
        {case_._count && (
          <div>
            <span className="text-muted-foreground">Reports:</span> {case_._count.reports}
          </div>
        )}
      </div>
    </div>
  );
}

function SearchResults({ results }: { results: any }) {
  if (!results || !results.reports || results.reports.length === 0) {
    return <p className="text-sm text-muted-foreground">No reports found</p>;
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">Found {results.total} report(s)</p>
      <div className="space-y-2">
        {results.reports.slice(0, 5).map((report: any) => (
          <div
            key={report.id}
            className="rounded border bg-background p-2 text-sm"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs">#{report.reportNumber}</span>
              <Badge variant="outline" className="text-xs">
                {report.status}
              </Badge>
            </div>
            <p className="mt-1 text-xs font-medium">{report.title}</p>
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
              {report.description}
            </p>
          </div>
        ))}
        {results.reports.length > 5 && (
          <p className="text-xs text-muted-foreground">
            And {results.reports.length - 5} more...
          </p>
        )}
      </div>
    </div>
  );
}
