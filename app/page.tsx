import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-content px-section-mobile py-16 lg:px-section-desktop">
          <h1 className="font-display text-4xl font-bold text-primary lg:text-5xl">
            NoorPath
          </h1>
          <p className="mt-4 text-lg text-muted">
            Quran Teaching Platform — Foundation Setup Complete
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Design System</CardTitle>
                <CardDescription>Colors, typography, and spacing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge>Primary</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="accent">Accent</Badge>
                  <Badge variant="destructive">Error</Badge>
                  <Badge variant="outline">Outline</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Components</CardTitle>
                <CardDescription>Button variants</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Button>Default</Button>
                <Button variant="secondary">Gold</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Forms</CardTitle>
                <CardDescription>Input component</CardDescription>
              </CardHeader>
              <CardContent>
                <Input placeholder="Type something..." />
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 space-y-4">
            <h2 className="font-display text-2xl font-bold text-primary">Typography</h2>
            <p className="font-display text-xl">
              Amiri — Display font for headings & Quranic text
            </p>
            <p className="font-body text-base">
              Plus Jakarta Sans — Body font for clean, modern UI text
            </p>
            <p className="font-urdu text-xl" dir="rtl">
              نوٹو نستعلیق اردو — اردو عبارات کے لیے
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
