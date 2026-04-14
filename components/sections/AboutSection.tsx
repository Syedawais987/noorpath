"use client";

import { motion } from "framer-motion";
import { Award, Globe, Clock, Heart } from "lucide-react";

const credentials = [
  {
    icon: <Award className="h-6 w-6 text-secondary" />,
    title: "Certified Teacher",
    description: "Ijazah-certified Quran teacher with formal training in Tajweed and Hifz",
  },
  {
    icon: <Clock className="h-6 w-6 text-secondary" />,
    title: "Years of Experience",
    description: "Dedicated years of teaching students of all ages and skill levels",
  },
  {
    icon: <Globe className="h-6 w-6 text-secondary" />,
    title: "Bilingual Classes",
    description: "Comfortable teaching in both English and Urdu for students worldwide",
  },
  {
    icon: <Heart className="h-6 w-6 text-secondary" />,
    title: "Student-Centered",
    description: "Patient, encouraging approach tailored to each student's unique pace",
  },
];

export function AboutSection() {
  return (
    <section id="about" className="bg-surface py-16 lg:py-24">
      <div className="mx-auto max-w-content px-section-mobile lg:px-section-desktop">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <h2 className="font-display text-3xl font-bold text-primary lg:text-4xl">
            About Your Teacher
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted">
            Alma E Deen is a passionate Quran teacher dedicated to making Quranic
            education accessible, personal, and effective. Her approach combines
            traditional teaching methods with modern tools for the best learning
            experience.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {credentials.map((item, index) => (
            <motion.div
              key={item.title}
              className="rounded-card border border-border bg-background p-6 text-center"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.2, ease: "easeOut", delay: index * 0.05 }}
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent">
                {item.icon}
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-muted">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
