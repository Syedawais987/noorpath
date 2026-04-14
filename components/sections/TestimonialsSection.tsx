"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Fatima Ahmed",
    location: "Rawalpindi, Pakistan",
    rating: 5,
    text: "My daughter has made incredible progress with Alma. She went from barely recognizing letters to reading fluently in just a few months. The one-on-one attention makes all the difference.",
  },
  {
    name: "Omar Hassan",
    location: "London, UK",
    rating: 5,
    text: "As an adult learner, I was nervous about starting Tajweed classes. Alma is incredibly patient and her structured approach helped me gain confidence quickly. Highly recommended!",
  },
  {
    name: "Ayesha Khan",
    location: "Dubai, UAE",
    rating: 5,
    text: "The Hifz program is excellent. Alma provides a clear memorization plan, regular revision schedules, and is always available for extra support. My son is thriving.",
  },
  {
    name: "Bilal Raza",
    location: "Islamabad, Pakistan",
    rating: 5,
    text: "I wanted to understand the meaning behind what I recite. Alma's translation classes opened up the Quran for me in a way I never expected. Life-changing experience.",
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="bg-background py-16 lg:py-24">
      <div className="mx-auto max-w-content px-section-mobile lg:px-section-desktop">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <h2 className="font-display text-3xl font-bold text-primary lg:text-4xl">
            What Students Say
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted">
            Hear from students and parents who have experienced Alma&apos;s teaching.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {testimonials.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.2, ease: "easeOut", delay: index * 0.05 }}
            >
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="flex gap-0.5">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-secondary text-secondary"
                      />
                    ))}
                  </div>
                  <p className="mt-4 text-foreground">{item.text}</p>
                  <div className="mt-4 border-t border-border pt-4">
                    <p className="font-semibold text-foreground">{item.name}</p>
                    <p className="text-sm text-muted">{item.location}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
