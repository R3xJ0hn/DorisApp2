import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Heart, LogOut, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { isAuthenticated, loadCurrentUser, logout } from "@/api/auth";
import { cn } from "@/lib/utils";
import {
  shopAccountItems,
  shopNavExploreLink,
  shopNavItems,
} from "@/lib/shop-nav";

function NavLinks({
  items,
  className,
}: {
  items: Array<{ label: string; href: string }>;
  className: string;
}) {
  return (
    <nav className={className}>
      {items.map((item) => (
        <Link
          key={item.label}
          className="transition-colors hover:text-(--shop-primary)"
          to={item.href}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

function IconButton({
  label,
  children,
  className = "",
  to,
}: {
  label: string;
  children: ReactNode;
  className?: string;
  to?: string;
}) {
  if (to) {
    return (
      <Button
        variant="ghost"
        size="icon-sm"
        className={cn(
          "text-(--shop-muted-foreground) hover:bg-(--shop-secondary) hover:text-(--shop-secondary-foreground)",
          className,
        )}
        aria-label={label}
        render={<Link to={to} />}
      >
        {children}
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className={cn(
        "text-(--shop-muted-foreground) hover:bg-(--shop-secondary) hover:text-(--shop-secondary-foreground)",
        className,
      )}
      aria-label={label}
    >
      {children}
    </Button>
  );
}

function ShopNavbar() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [userIsAuthenticated, setUserIsAuthenticated] = useState(
    isAuthenticated(),
  );
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const cartItemCount = 0;

  const toggleMobileMenu = () => {
    setMobileMenuOpen((open) => !open);
  };

  const handleAccountClick = () => {
    if (!userIsAuthenticated) {
      navigate("/login");
      return;
    }

    setAccountMenuOpen((open) => !open);
  };

  const handleLogout = async () => {
    await logout();
    setUserIsAuthenticated(false);
    setAccountMenuOpen(false);
    setMobileMenuOpen(false);
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    let isMounted = true;

    loadCurrentUser().then((user) => {
      if (isMounted) {
        setUserIsAuthenticated(Boolean(user));
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!accountMenuOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!accountMenuRef.current?.contains(event.target as Node)) {
        setAccountMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [accountMenuOpen]);

  return (
    <>
      <div
        className={cn(
          "hidden px-4 py-2 text-center text-sm md:block",
          "bg-(--shop-primary) text-(--shop-primary-foreground)",
        )}
      >
        {shopNavExploreLink[0]?.href ? (
          <Link
            to={shopNavExploreLink[0].href}
            className="underline-offset-4 hover:underline"
          >
            {shopNavExploreLink[0].label}
          </Link>
        ) : (
          <span>{shopNavExploreLink[0]?.label}</span>
        )}
      </div>

      <header
        className={cn(
          "sticky top-0 z-20 border-b shadow-sm",
          "border-(--shop-border) bg-(--shop-background) text-(--shop-foreground)",
        )}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center gap-3 px-4 md:px-6 lg:h-18.5 lg:gap-4">
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-(--shop-muted-foreground) hover:bg-(--shop-secondary) hover:text-(--shop-secondary-foreground) lg:hidden"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? (
              <X className="size-6" />
            ) : (
              <Menu className="size-6" />
            )}
          </Button>

          <Link
            to="/"
            className="flex items-center gap-2 font-semibold uppercase text-xl mr-5"
          >
            <span
              className={cn(
                "flex size-10 items-center justify-center rounded-xl",
                "bg-(--shop-primary) text-(--shop-primary-foreground)",
              )}
            >
              <ShoppingBag className="size-4 " />
            </span>
            Doris Shop
          </Link>

          <NavLinks
            items={shopNavItems}
            className={cn(
              "hidden flex-1 items-center justify-start gap-5 text-sm font-normal lg:flex",
              "text-(--shop-muted-foreground)",
            )}
          />

          <div
            className={cn(
              "ml-auto flex items-center gap-2 md:gap-5",
              "text-(--shop-muted-foreground)",
            )}
          >
            <label className="ml-auto hidden h-9 w-72 items-center gap-2 rounded-md border border-(--shop-border) bg-(--shop-background) px-3 text-sm text-(--shop-muted-foreground) lg:flex">
              <Search className="size-4 shrink-0" />
              <span className="sr-only">Search products</span>
              <input
                type="search"
                placeholder="Search products"
                className="h-full min-w-0 flex-1 bg-transparent text-(--shop-foreground) placeholder:text-(--shop-muted-foreground) outline-none"
              />
            </label>

            <IconButton label="Wishlist" className="hidden lg:inline-flex">
              <Heart className="size-5" />
            </IconButton>

            <IconButton label="Cart" className="relative">
              <ShoppingBag className="size-5" />
              {cartItemCount > 0 && (
                <span
                  className={cn(
                    "absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full text-xs font-bold",
                    "bg-(--shop-primary) text-(--shop-primary-foreground)",
                  )}
                >
                  {cartItemCount}
                </span>
              )}
            </IconButton>

            <div className="relative hidden lg:block" ref={accountMenuRef}>
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-(--shop-muted-foreground) hover:bg-(--shop-secondary) hover:text-(--shop-secondary-foreground)"
                aria-label="Account"
                aria-expanded={accountMenuOpen}
                aria-haspopup="menu"
                onClick={handleAccountClick}
              >
                <User className="size-5" />
              </Button>

              {userIsAuthenticated && accountMenuOpen && (
                <div
                  className="absolute right-0 top-11 z-30 w-44 rounded-lg border border-(--shop-border) bg-(--shop-background) p-1 shadow-lg"
                  role="menu"
                >
                  <Link
                    to="/account"
                    className="flex h-9 items-center rounded-md px-3 text-sm font-medium text-(--shop-foreground) hover:bg-(--shop-secondary)"
                    role="menuitem"
                    onClick={() => setAccountMenuOpen(false)}
                  >
                    My Account
                  </Link>
                  <button
                    type="button"
                    className="flex h-9 w-full items-center gap-2 rounded-md px-3 text-left text-sm font-medium text-(--shop-foreground) hover:bg-(--shop-secondary)"
                    role="menuitem"
                    onClick={handleLogout}
                  >
                    <LogOut className="size-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div
            className={cn(
              "border-t px-6 py-8 lg:hidden",
              "border-(--shop-border) bg-(--shop-background)",
            )}
          >
            <NavLinks
              items={shopNavItems}
              className={cn(
                "flex flex-col gap-9 text-xl font-medium",
                "text-(--shop-muted-foreground)",
              )}
            />

            <div className="mt-10 border-t border-(--shop-border) pt-9">
              {userIsAuthenticated ? (
                <nav
                  className={cn(
                    "flex flex-col gap-9 text-xl font-medium",
                    "text-(--shop-muted-foreground)",
                  )}
                >
                  <Link to="/account" onClick={() => setMobileMenuOpen(false)}>
                    My Account
                  </Link>
                  <button
                    type="button"
                    className="text-left"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </nav>
              ) : (
                <NavLinks
                  items={shopAccountItems}
                  className={cn(
                    "flex flex-col gap-9 text-xl font-medium",
                    "text-(--shop-muted-foreground)",
                  )}
                />
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}

export { ShopNavbar };
