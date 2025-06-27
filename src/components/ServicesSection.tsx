import { FaPaintBrush, FaLaptopCode, FaMobileAlt, FaCubes } from "react-icons/fa";
import Section from "@/components/Section";

const SERVICES = [
  {
    icon: FaPaintBrush,
    title: "UI/UX",
    description: "Creating intuitive and visually appealing designs that enhance user experience.",
  },
  {
    icon: FaLaptopCode,
    title: "Web Design",
    description: "Designing responsive and engaging websites tailored to user needs.",
  },
  {
    icon: FaMobileAlt,
    title: "App Design",
    description: "Crafting seamless and user-friendly mobile app interfaces.",
  },
  {
    icon: FaCubes,
    title: "Prototyping & Wireframing",
    description: "Building interactive prototypes and structured wireframes for better design flow.",
  },
];

export default function ServicesSection() {
  return (
    <Section id="services" title="Services" classes={{
      section: "px-4",
    }}>
      <p className="text-center max-w-xl mx-auto mb-10 text-primary-700">
        Transforming ideas into intuitive digital experiences
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map(({ icon: Icon, title, description }) => (
          <article
            key={title}
            className="p-6 border border-white/10 rounded-2xl text-center hover:shadow-lg bg-primary-600/70 hover:bg-primary-600 transition-all duration-300"
          >
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 text-2xl text-primary-200">
              <Icon className="text-3xl md:text-4xl"/>
            </div>
            <h4 className="mb-2 text-lg font-semibold text-white">{title}</h4>
            <p className="text-sm text-primary-100">{description}</p>
          </article>
        ))}
      </div>
    </Section>
  );
} 