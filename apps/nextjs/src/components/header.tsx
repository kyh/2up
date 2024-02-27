type PageHeaderProps = {
  children: React.ReactNode;
};

export const PageHeader = ({ children }: PageHeaderProps) => {
  return (
    <header className="flex items-center justify-between py-8">
      <h1 className="text-xl">{children}</h1>
    </header>
  );
};
