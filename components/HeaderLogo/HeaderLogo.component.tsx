// e.g. in your Header component
import Image from 'next/image'

export function HeaderLogo() {
  return <Image src="/logo-64.png" alt="Emojar Logo" width={138} height={64} priority />

}
