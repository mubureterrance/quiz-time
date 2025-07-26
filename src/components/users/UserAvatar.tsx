interface UserAvatarProps {
  name?: string;
  className?: string;
}

export default function UserAvatar({ name, className = "" }: UserAvatarProps) {
  const initial = name?.charAt(0)?.toUpperCase() || "U";
  
  return (
    <div 
      className={`w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm ${className}`}
      aria-label={`Avatar for ${name || 'user'}`}
    >
      {initial}
    </div>
  );
}