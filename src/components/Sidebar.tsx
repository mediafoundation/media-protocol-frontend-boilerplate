
import { PiHouseDuotone, PiHandshakeDuotone, PiStackDuotone, PiShoppingCartDuotone } from "react-icons/pi";
import Link from "next/link";
import { useRouter } from "next/router";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}


export const Sidebar = () => {

  const router = useRouter();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: PiHouseDuotone },
    { name: 'All Offers', href: '/offers', icon: PiShoppingCartDuotone },
    { name: 'My Resources', href: '/resources', icon: PiStackDuotone },
    { name: 'Deals as Provider', href: '/provider', icon: PiHandshakeDuotone },
    { name: 'Deals as Client', href: '/client', icon: PiHandshakeDuotone },
  ]
  const links = [
    { id: 1, name: 'Media Protocol', href: 'https://www.mediaprotocol.net', initial: 'P' },
    { id: 2, name: 'Media Foundation', href: 'https://x.com/Media_FDN', initial: 'F' },
    { id: 2, name: 'Github', href: 'https://github.com/mediafoundation', initial: 'G' },
  ]
  return (
    <>
      <nav className="flex flex-1 flex-col">

        <div className="flex h-16 shrink-0 items-center pl-2.5">
          <img
            className="h-8 w-auto"
            src="/images/medianetworkwhite.svg"
            alt="Media Protocol"
          />
        </div>
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={classNames(
                      router.pathname === item.href
                        ? 'active'
                        : 'not-active',
                      'menu-item'
                    )}
                  >
                    <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          <li>
            <hr className="border-dark-1500 mb-6"/>
            <ul role="list" className="mt-2 space-y-1">
              {links.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={classNames(
                      router.pathname === link.href
                        ? 'active'
                        : 'not-active',
                      'group menu-item'
                    )}
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-dark-1400 bg-dark-1700 text-[0.625rem] font-medium text-dark-300 group-hover:text-white">
                      {link.initial}
                    </span>
                    <span className="truncate">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          <li className="mt-auto">
            <Link
              href="#"
              className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-dark-300 hover:bg-dark-1700 hover:text-white"
            >
              Settings
            </Link>
          </li>
        </ul>
      </nav>
    </>
  )
}

export default Sidebar;