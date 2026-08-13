import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getMockCourseWithModules } from "@/lib/mock/api";

export default async function AdminCoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const data = await getMockCourseWithModules(courseId);

  if (!data) notFound();

  const { course, modules, classes, quiz } = data;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <h1 className="font-display text-2xl font-semibold text-foreground">{course.title}</h1>
        <Badge variant="outline">{course.status}</Badge>
      </div>
      <p className="text-sm text-muted-foreground">{course.description}</p>

      <Tabs defaultValue="modules">
        <TabsList>
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="quiz">Quiz</TabsTrigger>
          <TabsTrigger value="assignment">Assignment</TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg">Modules</CardTitle>
              <CardDescription>Ordered waypoints for this course.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {modules.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center gap-3 rounded-lg border border-border bg-background p-3"
                >
                  <span className="font-mono text-xs text-muted-foreground">{m.orderIndex}</span>
                  <span className="flex-1 text-sm font-medium text-foreground">{m.title}</span>
                  <Button size="sm" variant="outline" asChild>
                    <a href={`/console/courses/${courseId}/modules/${m.id}`}>Edit</a>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="classes" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg">Module classes</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {classes.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center gap-3 rounded-lg border border-border bg-background p-3"
                >
                  <span className="font-mono text-xs text-muted-foreground">{c.orderIndex}</span>
                  <span className="flex-1 text-sm font-medium text-foreground">{c.title}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quiz" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg">{quiz?.title ?? "Quiz"}</CardTitle>
              <CardDescription>
                {quiz ? `${quiz.questions.length} questions · pass ${Math.round((quiz.passThreshold ?? 1) * 100)}%` : "No quiz yet"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="sm">Add question</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignment" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg">Final assignment</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Final module ends with an assignment — prompt editor lands in a later pass.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}