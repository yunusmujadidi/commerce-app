interface HeadingProps {
  title: string;
  description: string;
}

export const Heading = ({ title, description }: HeadingProps) => {
  return (
    <div>
      <div className="text-3xl font-bold tracking-tight">{title}</div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};
