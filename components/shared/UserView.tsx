import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/shared/avatar';
import type { UserDTO } from '@/lib/api/models/dto/User';

function UserView({ user }: { user: UserDTO }) {
  return (
    <div className="flex items-center gap-2 min-w-0">
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage
          src="/placeholder.svg?height=32&width=32"
          alt={user.name}
        />
        <AvatarFallback>{user.name}</AvatarFallback>
      </Avatar>
      <span className="truncate text-sm">{user.name}</span>
    </div>
  );
}

export default UserView;
