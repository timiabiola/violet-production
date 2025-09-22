
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from 'lucide-react';

const AuthButtons = () => {
  const { user, signOut, hasRole } = useAuth();

  if (!user) {
    return (
      <Link to="/auth">
        <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
          Sign In
        </Button>
      </Link>
    );
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
          <User className="h-4 w-4 mr-2" />
          Account
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {hasRole('admin') && (
          <DropdownMenuItem asChild>
            <Link to="/admin" className="w-full cursor-pointer">
              Admin Dashboard
            </Link>
          </DropdownMenuItem>
        )}
        
        {hasRole('licensee') && (
          <DropdownMenuItem asChild>
            <Link to="/dashboard" className="w-full cursor-pointer">
              Business Dashboard
            </Link>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem asChild>
          <Link to="/profile" className="w-full cursor-pointer">
            Profile Settings
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AuthButtons;
