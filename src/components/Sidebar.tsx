
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
  const teams = [
    { id: 1, name: 'Heroicons', href: '#', initial: 'H' },
    { id: 2, name: 'Tailwind Labs', href: '#', initial: 'T' },
    { id: 3, name: 'Workcation', href: '#', initial: 'W' },
  ]
  return (
    <>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={classNames(
                      router.pathname === item.href
                        ? 'bg-neutral-900 text-white'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-900',
                      'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
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
            <div className="text-xs font-semibold leading-6 text-neutral-400">Your teams</div>
            <ul role="list" className="-mx-2 mt-2 space-y-1">
              {teams.map((team) => (
                <li key={team.name}>
                  <Link
                    href={team.href}
                    className={classNames(
                      router.pathname === team.href
                        ? 'bg-neutral-900 text-white'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-900',
                      'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                    )}
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-neutral-700 bg-neutral-900 text-[0.625rem] font-medium text-neutral-400 group-hover:text-white">
                      {team.initial}
                    </span>
                    <span className="truncate">{team.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          <li className="mt-auto">
            <Link
              href="#"
              className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-neutral-400 hover:bg-neutral-900 hover:text-white"
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