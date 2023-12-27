import { Fragment, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { HiBars2 } from "react-icons/hi2"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Sidebar } from "@components/Sidebar"
import { IoIosClose } from "react-icons/io"
import { useWalletContext } from "@contexts/WalletContext"
import Link from "next/link"

export function DefaultLayout({ children, pageProps }: any) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const wc = useWalletContext()

  return (
    <>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 lg:hidden"
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-dark-1800/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <IoIosClose
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-dark-1800 px-6 pb-4 ring-1 ring-white/10">
                  <Sidebar />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto  px-4 pb-4">
          <Sidebar />
        </div>
      </div>

      <div className="px-2 lg:px-4 lg:pl-72 ">
        <div className="flex h-16 shrink-0 items-center gap-x-4  shadow-sm sm:gap-x-6 justify-between lg:justify-end">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-dark-300 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <HiBars2 className="h-6 w-6" aria-hidden="true" />
          </button>
          <ConnectButton />
        </div>

        <main className="rounded-xl bg-dark-1700 border border-dark-1500">
          <div className="p-6">
            {children}
            {!pageProps.isIndex && !wc.marketplaceId && (
              <Link
                className="block text-center my-12 border rounded-xl max-w-sm p-6 text-xl"
                href="/"
              >
                <>Please initialize or select a Marketplace</>
              </Link>
            )}
          </div>
        </main>
      </div>
    </>
  )
}
export default DefaultLayout
