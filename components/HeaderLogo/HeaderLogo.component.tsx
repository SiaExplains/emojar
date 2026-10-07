import Image from 'next/image';

export function HeaderLogo() {
  return (
    <Image
      src="/logo.png"
      alt="Emojar – free online tools"
      width={505}
      height={128}
      className="h-8 w-auto sm:h-9"
      priority
    />
  );
}
