'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ThemeChanger from './DarkSwitch';
import Image from 'next/image';
import { Button, Disclosure } from '@headlessui/react';
import { useToast } from '@/hooks/use-toast';
import { getMessaging, getToken } from 'firebase/messaging';
import firebaseApp from '@/utils/firebase-messaging-sw';
import useFcmToken from '@/utils/hooks/useFcmToken';
import { dispatchToken } from '@/components/FcmClient';

export const Navbar = () => {
  const navigation = ['Product', 'Features', 'Pricing', 'Company', 'Blog'];
  const { toast } = useToast();
  const {
    notificationPermissionStatus,
    setToken,
    setNotificationPermissionStatus,
  } = useFcmToken();

  function getBrowserInfo() {
    let browserName = 'Unknown';
    let browserVersion = 'Unknown';

    if (typeof navigator === 'undefined') {
      return { browserName, browserVersion };
    }

    const userAgent = navigator.userAgent;

    if (userAgent.includes('Firefox')) {
      browserName = 'Firefox';
      browserVersion = userAgent.match(/Firefox\/([\d.]+)/)?.[1] || 'Unknown';
    } else if (userAgent.includes('Edg')) {
      browserName = 'Edge';
      browserVersion = userAgent.match(/Edg\/([\d.]+)/)?.[1] || 'Unknown';
    } else if (userAgent.includes('Chrome')) {
      browserName = 'Chrome';
      browserVersion = userAgent.match(/Chrome\/([\d.]+)/)?.[1] || 'Unknown';
    } else if (userAgent.includes('Safari')) {
      browserName = 'Safari';
      browserVersion = userAgent.match(/Version\/([\d.]+)/)?.[1] || 'Unknown';
    } else if (userAgent.includes('Opera') || userAgent.includes('OPR')) {
      browserName = 'Opera';
      browserVersion =
        userAgent.match(/(Opera|OPR)\/([\d.]+)/)?.[2] || 'Unknown';
    } else if (userAgent.includes('MSIE') || userAgent.includes('Trident')) {
      browserName = 'Internet Explorer';
      browserVersion = userAgent.match(/(MSIE |rv:)([\d.]+)/)?.[2] || 'Unknown';
    }

    return { browserName, browserVersion };
  }

  // function getAgentSystem() {
  //   if (!('navigator' in window)) {
  //     return 'unknown';
  //   }

  //   // Use the modern 'web hints' provied by
  //   // 'userAgentData' if available, else use
  //   // the deprecated 'platform' as fallback.
  //   const platform = navigator.userAgent?.toLowerCase();

  //   if (platform.includes('win')) return 'WINDOWS';
  //   if (platform.includes('mac')) return 'MACOS';
  //   if (platform.includes('linux')) return 'LINUX';
  //   return 'unknown';
  // }

  const getPermission = async () => {
    if (getBrowserInfo().browserName === 'Safari') {
      if (notificationPermissionStatus !== 'granted') {
        toast({
          variant: 'destructive',
          title: 'B-Push',
          description:
            '사용자 브라우저의 알림 상태는 Off 입니다. 알림을 켜주세요.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'B-Push',
          description: '사용자 브라우저의 알림 상태는 On 입니다.',
        });
      }
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      toast({
        variant: 'destructive',
        title: 'B-Push',
        description:
          '사용자 브라우저의 알림 상태는 Off 입니다. 알림을 켜주세요.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'B-Push',
        description: '사용자 브라우저의 알림 상태는 On 입니다.',
      });
    }
  };

  useEffect(() => {
    getPermission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className='w-full'>
      <nav className='container relative flex flex-wrap items-center justify-between p-8 mx-auto lg:justify-between xl:px-1'>
        {/* Logo  */}
        <Link href='/'>
          <span className='flex items-center space-x-2 text-2xl font-medium text-indigo-500 dark:text-gray-100'>
            <span>
              <Image
                src='/img/logo.svg'
                width='32'
                alt='N'
                height='32'
                className='w-8'
              />
            </span>
            <span>Nextly</span>
          </span>
        </Link>

        {/* get started  */}
        <div className='gap-3 nav__item mr-2 lg:flex ml-auto lg:ml-0 lg:order-2'>
          <ThemeChanger />
          <div className='hidden mr-3 lg:flex nav__item'>
            {/* {getAgentSystem() !== 'MACOS' && ( */}
            {getBrowserInfo().browserName !== 'Safari' && (
              <Link
                href='/'
                className='px-6 py-2 text-white bg-indigo-600 rounded-md md:ml-5'
              >
                Get Started
              </Link>
            )}

            {/* {getAgentSystem() === 'MACOS' && ( */}
            {getBrowserInfo().browserName === 'Safari' && (
              <Button
                className='px-6 py-2 text-white bg-indigo-600 rounded-md md:ml-5'
                onClick={async () => {
                  if (
                    typeof window !== 'undefined' &&
                    'serviceWorker' in navigator
                  ) {
                    const messaging = getMessaging(firebaseApp);

                    // Retrieve the notification permission status
                    const permission = await Notification.requestPermission();
                    console.log('updated permission: ', permission);
                    setNotificationPermissionStatus(permission);

                    // Check if permission is granted before retrieving the token
                    if (permission === 'granted') {
                      const currentToken = await getToken(messaging, {
                        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
                      });
                      console.log(`current token: ${currentToken}`);
                      if (currentToken) {
                        setToken(currentToken);

                        dispatchToken(currentToken, permission);
                      } else {
                        console.log(
                          'No registration token available. Request permission to generate one.',
                        );
                      }
                    } else {
                      console.log(`so may be here?? ${permission}`);
                    }
                  } else {
                    console.log('so may be here?');
                  }
                }}
              >
                Request Push Token
              </Button>
            )}
          </div>
        </div>

        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button
                aria-label='Toggle Menu'
                className='px-2 py-1 text-gray-500 rounded-md lg:hidden hover:text-indigo-500 focus:text-indigo-500 focus:bg-indigo-100 focus:outline-none dark:text-gray-300 dark:focus:bg-trueGray-700'
              >
                <svg
                  className='w-6 h-6 fill-current'
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                >
                  {open && (
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z'
                    />
                  )}
                  {!open && (
                    <path
                      fillRule='evenodd'
                      d='M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z'
                    />
                  )}
                </svg>
              </Disclosure.Button>

              <Disclosure.Panel className='flex flex-wrap w-full my-5 lg:hidden'>
                <>
                  {navigation.map((item, index) => (
                    <Link
                      key={index}
                      href='/'
                      className='w-full px-4 py-2 -ml-4 text-gray-500 rounded-md dark:text-gray-300 hover:text-indigo-500 focus:text-indigo-500 focus:bg-indigo-100 dark:focus:bg-gray-800 focus:outline-none'
                    >
                      {item}
                    </Link>
                  ))}
                  {/* <Link
                    href='/'
                    className='w-full px-6 py-2 mt-3 text-center text-white bg-indigo-600 rounded-md lg:ml-5'
                  >
                    Get Started !!
                  </Link> */}
                  {getBrowserInfo().browserName === 'Safari' && (
                    <Button
                      className='px-6 py-2 text-white bg-indigo-600 rounded-md md:ml-5'
                      onClick={async () => {
                        if (
                          typeof window !== 'undefined' &&
                          'serviceWorker' in navigator
                        ) {
                          const messaging = getMessaging(firebaseApp);

                          // Retrieve the notification permission status
                          const permission =
                            await Notification.requestPermission();
                          console.log('updated permission: ', permission);
                          setNotificationPermissionStatus(permission);

                          // Check if permission is granted before retrieving the token
                          if (permission === 'granted') {
                            const currentToken = await getToken(messaging, {
                              vapidKey:
                                process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
                            });
                            console.log(`current token: ${currentToken}`);
                            if (currentToken) {
                              setToken(currentToken);

                              dispatchToken(currentToken, permission);
                            } else {
                              console.log(
                                'No registration token available. Request permission to generate one.',
                              );
                            }
                          } else {
                            console.log(`so may be here?? ${permission}`);
                          }
                        } else {
                          console.log('so may be here?');
                        }
                      }}
                    >
                      Request Push Token
                    </Button>
                  )}
                </>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        {/* menu  */}
        <div className='hidden text-center lg:flex lg:items-center'>
          <ul className='items-center justify-end flex-1 pt-6 list-none lg:pt-0 lg:flex'>
            {navigation.map((menu, index) => (
              <li
                className='mr-3 nav__item'
                key={index}
              >
                <Link
                  href='/'
                  className='inline-block px-4 py-2 text-lg font-normal text-gray-800 no-underline rounded-md dark:text-gray-200 hover:text-indigo-500 focus:text-indigo-500 focus:bg-indigo-100 focus:outline-none dark:focus:bg-gray-800'
                >
                  {menu}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
};
