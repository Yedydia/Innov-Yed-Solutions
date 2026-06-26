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
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B0F1A]/98 via-[#0B0F1A]/85 to-[#0B0F1A]/90" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F1A]/95 via-[#0B0F1A]/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-l from-black/60 via-black/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
      <div className="absolute inset-0 mix-blend-overlay bg-gradient-to-b from-black/50 via-transparent to-black/20" />
      <div className="relative z-10 h-full flex flex-col justify-center px-8">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-2 drop-shadow-2xl drop-shadow-black/60">{title}</h1>
        {subtitle && <p className="text-sm text-gray-100 font-medium drop-shadow-lg drop-shadow-black/40">{subtitle}</p>}
      </div>
    </div>
  );
}
