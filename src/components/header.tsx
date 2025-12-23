import Image from 'next/image';

const Header = () => {
  return (
    <header className="sticky top-0 z-40 w-full bg-background/60 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto flex h-16 items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <Image src="/gitexplore.png" alt="GitExplore Logo" width={28} height={28} className="h-7 w-7" />
          <h1 className="text-2xl font-bold text-foreground">
            Git<span className="text-primary">Explore</span>
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
