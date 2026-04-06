import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl gradient-bg flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <span className="text-xl font-bold gradient-text">Shoe Catalog</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Your one-stop destination for premium fashion for the entire family.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/products?category=mens" className="hover:text-foreground transition-colors">Men's</Link></li>
              <li><Link href="/products?category=womens" className="hover:text-foreground transition-colors">Women's</Link></li>
              <li><Link href="/products?category=kids" className="hover:text-foreground transition-colors">Kids</Link></li>
              <li><Link href="/products?category=sports" className="hover:text-foreground transition-colors">Sports</Link></li>
              <li><Link href="/products?category=formal" className="hover:text-foreground transition-colors">Formal</Link></li>
              <li><Link href="/products?category=casual" className="hover:text-foreground transition-colors">Casual</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Account</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/favourites" className="hover:text-foreground transition-colors">Favourites</Link></li>
              <li><Link href="/profile" className="hover:text-foreground transition-colors">Profile</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Shipping</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Returns</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 Shoe Catalog. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Powered by Supabase</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
