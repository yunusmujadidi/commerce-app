interface HeadingProps {
  title: string;
  description?: string;
  className?: string;
}

export const Heading = ({ title, description, className }: HeadingProps) => {
  return (
    <div className={className}>
      <div className="text-3xl font-bold tracking-tight">{title}</div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};
