"use client";

import { motion } from "framer-motion";
import { BookOpen, BookMarked, Mic, Languages } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const courses = [
  {
    icon: <BookOpen className="h-8 w-8 text-primary" />,
    title: "Nazra",
    description:
      "Learn to read the Quran fluently with correct pronunciation. Perfect for beginners starting their Quran journey.",
    level: "Beginner",
  },
  {
    icon: <BookMarked className="h-8 w-8 text-primary" />,
    title: "Hifz",
    description:
      "Memorize the Quran with structured guidance, revision plans, and regular progress tracking.",
    level: "All Levels",
  },
  {
    icon: <Mic className="h-8 w-8 text-primary" />,
    title: "Tajweed",
    description:
      "Master the rules of Quranic recitation — proper articulation points, characteristics, and melody.",
    level: "Intermediate",
  },
  {
    icon: <Languages className="h-8 w-8 text-primary" />,
    title: "Translation",
    description:
      "Understand the meaning of what you recite. Word-by-word translation and tafseer for deeper comprehension.",
    level: "All Levels",
  },
];

export function CoursesSection() {
  return (
    <section id="courses" className="bg-background py-16 lg:py-24">
      <div className="mx-auto max-w-content px-section-mobile lg:px-section-desktop">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <h2 className="font-display text-3xl font-bold text-primary lg:text-4xl">
            What You&apos;ll Learn
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted">
            Choose the path that matches your goals. All courses are taught one-on-one
            for maximum attention and progress.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {courses.map((course, index) => (
            <motion.div
              key={course.title}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.2, ease: "easeOut", delay: index * 0.05 }}
            >
              <Card className="h-full transition-shadow duration-200 hover:shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-card bg-accent">
                      {course.icon}
                    </div>
                    <Badge variant="accent">{course.level}</Badge>
                  </div>
                  <CardTitle className="mt-4">{course.title}</CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
