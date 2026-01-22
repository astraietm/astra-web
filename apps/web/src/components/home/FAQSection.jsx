import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Who can participate in ASTRA?",
    answer:
      "ASTRA is open to all students, developers, and tech enthusiasts. Whether you're a beginner or an experienced developer, you're welcome to join. Participants can be from any college, university, or working professionals passionate about technology.",
  },
  {
    question: "What is the team size requirement?",
    answer:
      "Teams can have 2-4 members. You can also register individually and we'll help you find teammates during our team formation phase. Solo participation is not allowed to encourage collaboration.",
  },
  {
    question: "Is there a registration fee?",
    answer:
      "No, participation in ASTRA is completely free. We believe in making tech events accessible to everyone. All you need is passion, creativity, and a willingness to build something amazing.",
  },
  {
    question: "What should I bring to the hackathon?",
    answer:
      "Bring your laptop, charger, and any hardware you might need for your project. We'll provide food, drinks, swag, and a comfortable hacking environment. Most importantly, bring your ideas and enthusiasm!",
  },
  {
    question: "Can I start working on my project before the event?",
    answer:
      "No, all coding must be done during the 24-hour hackathon period. However, you can brainstorm ideas, research technologies, and plan your approach beforehand. Pre-written code or existing projects are not allowed.",
  },
  {
    question: "How are projects judged?",
    answer:
      "Projects are evaluated on innovation, technical complexity, design & user experience, and real-world impact. Each track has specific criteria relevant to its domain. Industry experts and mentors form the judging panel.",
  },
];

export function FAQSection() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section id="faq" className="relative border-t border-border bg-background py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6">
        {/* Header */}
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 text-center"
        >
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            FAQ
          </p>
          <h2 className="mt-4 text-3xl font-normal tracking-tight text-foreground md:text-4xl">
            Questions & Answers
          </h2>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-border rounded-lg px-6 data-[state=open]:bg-card"
              >
                <AccordionTrigger className="text-left text-sm font-medium hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
