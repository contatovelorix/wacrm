'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import {
  Bell,
  LogOut,
  Menu,
  Search,
  Settings as SettingsIcon,
  User,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ModeToggle } from '@/components/layout/mode-toggle';
import { useUnreadNotifications } from '@/hooks/use-unread-notifications';

const pageTitles: Record<string, string> = {
  '/dashboard': 'dashboard',
  '/inbox': 'inbox',
  '/notifications': 'notifications',
  '/contacts': 'contacts',
  '/pipelines': 'pipelines',
  '/broadcasts': 'broadcasts',
  '/automations': 'automations',
  '/settings': 'settings',
};

function getPageTitleKey(pathname: string): string {
  if (pageTitles[pathname]) return pageTitles[pathname];
  const match = Object.entries(pageTitles).find(([path]) =>
    pathname.startsWith(path)
  );
  return match ? match[1] : 'dashboard';
}

interface HeaderProps {
  /** Wired to the shell's drawer state. Used only on mobile — the
   *  hamburger button is hidden on lg+. */
  onOpenSidebar?: () => void;
}

import { useTranslations } from 'next-intl';

export function Header({ onOpenSidebar }: HeaderProps) {
  const t = useTranslations('Header');
  const pathname = usePathname();
  const { profile, account, signOut } = useAuth();
  const unreadNotifications = useUnreadNotifications();
  const titleKey = getPageTitleKey(pathname);

  const initial =
    profile?.full_name?.charAt(0)?.toUpperCase() ??
    profile?.email?.charAt(0)?.toUpperCase() ??
    'U';

  return (
    <header className="border-border/70 bg-background/85 flex h-16 shrink-0 items-center justify-between gap-3 border-b px-3 backdrop-blur-xl sm:px-5 lg:h-[72px] lg:px-8">
      <div className="flex min-w-0 items-center gap-2">
        {/* Hamburger — mobile only. 44×44 hit target per Apple HIG. */}
        <button
          type="button"
          onClick={onOpenSidebar}
          aria-label={t('openMenu')}
          className="text-muted-foreground hover:bg-muted hover:text-foreground flex h-10 w-10 items-center justify-center rounded-md transition-colors lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-foreground truncate text-base font-semibold tracking-tight sm:text-lg lg:hidden">
          {t(titleKey as string)}
        </h1>
      </div>

      <div className="hidden flex-1 justify-center px-8 lg:flex">
        <Link
          href="/contacts"
          className="border-border/70 bg-card text-muted-foreground hover:border-primary/30 flex h-10 w-full max-w-md items-center gap-3 rounded-2xl border px-4 text-sm shadow-sm transition"
          aria-label={t('search')}
        >
          <Search className="size-4" />
          <span>{t('search')}</span>
          <kbd className="bg-muted ml-auto rounded-md px-2 py-0.5 text-[10px] font-semibold">
            /
          </kbd>
        </Link>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <Link
          href="/notifications"
          aria-label={t('notifications')}
          className="text-muted-foreground hover:bg-muted hover:text-foreground relative flex size-10 items-center justify-center rounded-xl transition"
        >
          <Bell className="size-[18px]" />
          {unreadNotifications > 0 && (
            <span className="bg-primary ring-background absolute top-2 right-2 size-2 rounded-full ring-2" />
          )}
        </Link>
        <div className="hidden sm:block">
          <ModeToggle />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            className="hover:bg-muted/70 focus:bg-muted/70 data-popup-open:bg-muted/70 flex items-center gap-2 rounded-md px-1 py-1 transition-colors focus:outline-none sm:gap-3 sm:pr-3 sm:pl-1"
            aria-label={t('openAccountMenu')}
          >
            <Avatar className="size-8">
              {profile?.avatar_url ? (
                <AvatarImage
                  src={profile.avatar_url}
                  alt={profile.full_name ?? t('defaultAvatar')}
                />
              ) : null}
              <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                {initial}
              </AvatarFallback>
            </Avatar>
            <span className="hidden min-w-0 sm:block">
              <span className="text-foreground block max-w-32 truncate text-left text-sm font-semibold">
                {profile?.full_name ?? t('defaultUser')}
              </span>
              {account?.name && (
                <span className="text-muted-foreground block max-w-32 truncate text-left text-[11px]">
                  {account.name}
                </span>
              )}
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={6}
            className="bg-popover text-popover-foreground ring-border min-w-56"
          >
            <div className="px-2 py-1.5">
              <p className="text-foreground truncate text-sm font-medium">
                {profile?.full_name ?? t('defaultUser')}
              </p>
              <p className="text-muted-foreground truncate text-xs">
                {profile?.email ?? ''}
              </p>
            </div>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem
              render={
                <Link
                  href="/settings?tab=profile"
                  className="text-popover-foreground focus:bg-accent focus:text-accent-foreground"
                />
              }
            >
              <User className="size-4" />
              {t('menuProfile')}
            </DropdownMenuItem>
            <DropdownMenuItem
              render={
                <Link
                  href="/settings?tab=whatsapp"
                  className="text-popover-foreground focus:bg-accent focus:text-accent-foreground"
                />
              }
            >
              <SettingsIcon className="size-4" />
              {t('menuSettings')}
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem
              onClick={signOut}
              className="text-popover-foreground focus:bg-accent focus:text-accent-foreground"
            >
              <LogOut className="size-4" />
              {t('menuSignOut')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
