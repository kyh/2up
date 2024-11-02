"use client";

type PageHeaderProps = {
  children: React.ReactNode;
};

export const PageHeader = ({ children }: PageHeaderProps) => {
  return (
    <header className="flex h-20 items-center justify-between md:h-24">
      <h1 className="text-xl">{children}</h1>
      <div className="flex gap-1"></div>
    </header>
  );
};
