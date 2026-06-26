type Props = {
  title: string;
  subtitle?: string;
  image: string;
};

export default function AdminPageHeader({ title, subtitle, image }: Props) {
  return (
    <div className="relative rounded-2xl overflow-hidden mb-8 h-52 bg-[#111827]">
      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F1A]/90 via-[#0B0F1A]/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F1A]/80 via-transparent to-transparent" />
      <div className="relative z-10 h-full flex flex-col justify-center px-8">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-2 drop-shadow-lg">{title}</h1>
        {subtitle && <p className="text-sm text-gray-300 drop-shadow">{subtitle}</p>}
      </div>
    </div>
  );
}
