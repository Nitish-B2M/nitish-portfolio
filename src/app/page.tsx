import Hero from "@/components/Hero";
import Section from "@/components/Section";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import ProjectsGallery from "@/components/ProjectsGallery";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import ContactSection from "@/components/ContactSection";
import Navbar from "@/components/Navbar";

async function getProjects() {
  try {
    // For server components in development
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/projects`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export default async function Home() {
  // For now we'll use fallback data in case the API fails
  const fallbackProjects = [
    {
      id: "1",
      title: "Portfolio site",
      description: "This site you're looking at!",
      category: "FRONTEND" as const,
      tags: ["Next.js", "React", "TypeScript", "Tailwind"],
      imageUrl: "/projects/portfolio.jpg"
    },
    {
      id: "2",
      title: "E-commerce Platform",
      description: "Full-featured online store with cart and payments",
      category: "FULLSTACK" as const,
      tags: ["Next.js", "Node.js", "PostgreSQL", "Stripe"],
      imageUrl: "/projects/ecommerce.jpg"
    },
    {
      id: "3",
      title: "API Gateway",
      description: "Microservices API gateway with rate limiting",
      category: "BACKEND" as const,
      tags: ["Node.js", "Express", "Redis", "Docker"],
      imageUrl: "/projects/api.jpg"
    },
    {
      id: "4",
      title: "AI Chatbot",
      description: "AI chatbot with natural language processing",
      category: "FULLSTACK" as const,
      tags: ["Next.js", "Node.js", "PostgreSQL", "Stripe"],
      imageUrl: "/projects/ai.jpg"
    }
  ];

  const experiences = [
    {
      company: "ACME Inc.",
      title: "Front-End Dev",
      start: "2021-05",
      end: "2023-02",
      description: "Built a design system and migrated legacy code."
    },
    {
      company: "Tech Corp",
      title: "Full Stack Developer",
      start: "2023-03",
      end: "Present",
      description: "Leading development of microservices architecture and modern web applications."
    }
  ];
  
  // Fetch projects from API, fallback to dummy data if it fails
  const projects = await getProjects() || fallbackProjects;
  console.log(projects);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ServicesSection />
        
        <Section id="experience" title="Experience" classes={{
          section: "px-4",
        }}>
          <ExperienceTimeline items={experiences} />
        </Section>

        <Section id="projects" title="Projects">
          <ProjectsGallery projects={projects} />
        </Section>

        <AboutSection />
        <ContactSection />
      </main>
    </>
  );
} 