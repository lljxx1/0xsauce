import Link from 'next/link'
import { FC } from 'react'

const NAVBAR_LOGO = process.env.NEXT_PUBLIC_NAVBAR_LOGO
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID
const SOURCE_ID = process.env.NEXT_PUBLIC_SOURCE_ID
const SOURCE_NAME = process.env.NEXT_PUBLIC_SOURCE_NAME
const DESKTOP_NAVBAR_LOGO = process.env.NEXT_PUBLIC_DESKTOP_NAVBAR_LOGO
const NAVBAR_LOGO_LINK = process.env.NEXT_PUBLIC_NAVBAR_LOGO_LINK

type Props = {
  variant?: 'desktop' | 'mobile' | undefined
  className?: string
}

const NavbarLogo: FC<Props> = ({ variant, className }) => {
  const logo = NAVBAR_LOGO || '/0xsauce.svg'
  const desktopLogo = DESKTOP_NAVBAR_LOGO || '/0xsauce-desktop.svg'
  let logoAlt = 'Logo'

  if (SOURCE_NAME) {
    logoAlt = SOURCE_NAME
  } else if (SOURCE_ID) {
    logoAlt = SOURCE_ID
  }

  const mobileVariant = variant == 'mobile'
  const desktopVariant = variant == 'desktop'
  const isTestNet = CHAIN_ID === '4'

  return (
    <Link href={NAVBAR_LOGO_LINK || '/'}>
      <a
        className={`relative inline-flex flex-none items-center gap-1 ${className}`}
      >
        <img
          src={logo}
          alt={logoAlt}
          className={`h-9 w-auto ${!variant ? 'md:hidden' : ''} ${
            desktopVariant ? 'hidden' : ''
          } ${mobileVariant ? 'block' : ''}`}
        />
        <img
          src={desktopLogo}
          alt={logoAlt}
          className={`h-9 w-auto md:block ${
            !variant ? 'hidden md:block' : ''
          } ${mobileVariant ? 'hidden' : ''} ${desktopVariant ? 'block' : ''}`}
        />
      </a>
    </Link>
  )
}

export default NavbarLogo
