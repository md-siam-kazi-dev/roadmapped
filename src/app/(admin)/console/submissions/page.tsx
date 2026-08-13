import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getMockSubmissions } from "@/lib/mock/api";
import type { SubmissionStatus } from "@/types/api";

export const metadata: Metadata = { title: "Submissions — Console" };

const statusBadge = (status: SubmissionStatus) => {
  if (status === "PENDING")
    return <Badge className="border-ember/40 bg-ember/10 text-ember">Pending</Badge>;
  if (status === "APPROVED")
    return <Badge className="border-success/40 bg-success/10 text-success">Approved</Badge>;
  return <Badge className="border-danger/40 bg-danger/10 text-danger">Rejected</Badge>;
};

export default async function SubmissionsPage() {
  const submissions = await getMockSubmissions();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-foreground">Assignment submissions</h1>
        <p className="text-sm text-muted-foreground">Review queue — pending first.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg">All submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Learner</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.learner?.name ?? "—"}</TableCell>
                  <TableCell>{s.course?.title ?? "Frontend Web Dev"}</TableCell>
                  <TableCell>{statusBadge(s.status)}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {new Date(s.submittedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button size="sm" asChild>
                      <a href={`/console/submissions/${s.id}`}>Review</a>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}