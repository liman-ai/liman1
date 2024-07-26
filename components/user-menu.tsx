'use client'

import { useState } from 'react'; // Bu satırı ekleyin
import { type Session } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { signOut } from '@/auth';
import ChangePasswordModal from './ChangePasswordModal'; // Bu satırı ekleyin

export interface UserMenuProps {
  user: Session['user'];
}

function getUserInitials(email: string) { // name yerine email'i kullanarak fonksiyonu güncelleyin
  const [firstName, lastName] = email.split('@')[0].split('.');
  return lastName ? `${firstName[0]}${lastName[0]}` : firstName.slice(0, 2).toUpperCase();
}

export function UserMenu({ user }: UserMenuProps) {
  const [isChangePasswordModalOpen, setChangePasswordModalOpen] = useState(false); // Bu satırı ekleyin

  return (
    <div className="flex items-center justify-between">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="pl-0">
            <div className="flex size-7 shrink-0 select-none items-center justify-center rounded-full bg-muted/50 text-xs font-medium uppercase text-muted-foreground">
              {getUserInitials(user.email)} // Bu satırı güncelleyin
            </div>
            <span className="ml-2 hidden md:block">{user.email}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent sideOffset={8} align="start" className="w-fit">
          <DropdownMenuItem className="flex-col items-start">
            <div className="text-xs text-zinc-500">{user.email}</div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-xs outline-none transition-colors hover:bg-gray-200 focus:bg-accent focus:text-accent-foreground"
            onClick={() => setChangePasswordModalOpen(true)} // Bu satırı ekleyin
          >
            Change Password
          </DropdownMenuItem>
          <DropdownMenuSeparator /> // Bu satırı ekleyin
          <form
            action={async () => {
              'use server';
              await signOut();
            }}
          >
            <button className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-xs outline-none transition-colors hover:bg-red-500 hover:text-white focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
              Sign Out
            </button>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>
      {isChangePasswordModalOpen && (
        <ChangePasswordModal onClose={() => setChangePasswordModalOpen(false)} /> // Bu satırı ekleyin
      )}
    </div>
  );
}
