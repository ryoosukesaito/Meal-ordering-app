'use client'

import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { signOut } from 'firebase/auth'
import Link from 'next/link'
import { Fragment } from 'react'

import { auth } from '@/firebase'

export function Header() {
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log('User logged out')
        window.location.replace('/')
      })
      .catch((error) => {
        console.log('there was an error on Logout>> ', error.message)
      })
  }

  return (
    <div className="fixed w-full bg-white text-black shadow-2xl">
      <div className="flex h-14 items-center justify-between px-5">
        <Link
          href={'/admin/dashboard'}
          className="text-lg font-semibold hover:text-gray-300"
        >
          <p>Order meal app</p>
        </Link>

        <section>
          <div className="">
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="group inline-flex w-full justify-center rounded-md bg-opacity-20 px-4 py-2 text-sm font-medium text-black hover:bg-gray-200">
                  Admin
                  <ChevronDownIcon
                    className="-mr-1 ml-2 h-5 w-5 text-gray-300 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-36 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-1 py-1 ">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={`${
                            active ? 'bg-gray-200 text-black' : 'text-gray-500'
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        >
                          logout
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </section>
      </div>
    </div>
  )
}
