interface Props {
  id: string;
  title?: string;
  children: React.ReactNode;
  classes?: {
    section?: string;
    title?: string;
    content?: string;
  };
}

export default function Section({ id, title, children, classes }: Props) {
  return (
    <section id={id} className={`py-16 scroll-mt-20 bg-primary-900/20 ${classes?.section}`}>
      {title && <h2 className={`mb-8 text-3xl font-bold text-center ${classes?.title}`}>{title}</h2>}
      <div className={`max-w-5xl mx-auto ${classes?.content}`}>{children}</div>
    </section>
  );
} 