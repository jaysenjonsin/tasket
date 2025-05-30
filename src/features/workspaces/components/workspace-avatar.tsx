import Image from 'next/image';
import { cn } from '../../../lib/utils';
import { Avatar, AvatarFallback } from '../../../components/ui/avatar';

interface WorkspaceAvatarProps {
  image?: string;
  name: string;
  className?: string;
}

export const WorkspaceAvatar = ({
  image,
  name,
  className,
}: WorkspaceAvatarProps) => {
  //using <AvatarImage from shadcn causing a flickering effect, doing this instead
  if (image) {
    return (
      <div
        className={cn('size-10 relative rounded-md overflow-hidden', className)}
      >
        <Image
          src={image}
          alt={name}
          fill
          className='object-cover rounded-md'
        />
      </div>
    );
  }

  return (
    <Avatar className={cn('size-10 rounded-md', className)}>
      <AvatarFallback className='rounded-md text-white bg-blue-600 font-semibold text-lg uppercase truncate'>
        {name[0]}
      </AvatarFallback>
    </Avatar>
  );
};
