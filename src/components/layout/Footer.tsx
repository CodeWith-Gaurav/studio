export function Footer() {
  return (
    <footer className="bg-card border-t border-border py-6 text-center text-muted-foreground">
      <div className="container mx-auto px-4">
        <p>&copy; {new Date().getFullYear()} Potato Pal. All rights reserved.</p>
      </div>
    </footer>
  );
}
