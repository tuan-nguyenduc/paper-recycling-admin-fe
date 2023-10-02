import ChartBarIcon from '@heroicons/react/24/solid/ChartBarIcon';
import ShoppingBagIcon from '@heroicons/react/24/solid/ShoppingBagIcon';
import { SvgIcon } from '@mui/material';
import { LuSchool } from 'react-icons/lu';
import { IoIosSchool } from 'react-icons/io';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { BiCategoryAlt } from 'react-icons/bi';
import { IoSchoolSharp } from 'react-icons/io5';
import { FaHistory } from 'react-icons/fa';

export const items = [
  {
    title: 'Overview',
    path: '/',
    icon: (
      <SvgIcon fontSize="small">
        <ChartBarIcon/>
      </SvgIcon>
    )
  },

  {
    title: 'Categories',
    path: '/categories',
    icon: (
      <SvgIcon fontSize="small">
        <BiCategoryAlt/>
      </SvgIcon>
    )
  },
  {
    title: 'Products',
    path: '/products',
    icon: (
      <SvgIcon fontSize="small">
        <ShoppingBagIcon/>
      </SvgIcon>
    )
  },
  {
    title: 'Orders',
    path: '/order',
    icon: (
      <SvgIcon fontSize="small">
        <AiOutlineShoppingCart/>
      </SvgIcon>
    )
  },
  {
    title: 'Students',
    path: '/students',
    icon: (
      <SvgIcon fontSize="small">
        <IoIosSchool/>
      </SvgIcon>
    )
  },
  {
    title: 'Schools',
    path: '/schools',
    icon: (
      <SvgIcon fontSize="small">
        <LuSchool/>
      </SvgIcon>
    )
  },
  {
    title: 'Classes',
    path: '/classes',
    icon: (
      <SvgIcon fontSize="small">
        <IoSchoolSharp/>
      </SvgIcon>
    )
  },
  {
    title: 'Paper Collect Histories',
    path: '/paper-collect-histories',
    icon: (
      <SvgIcon fontSize="small">
        <FaHistory/>
      </SvgIcon>
    )
  }
  // {
  //   title: 'Login',
  //   path: '/auth/login',
  //   icon: (
  //     <SvgIcon fontSize="small">
  //       <LockClosedIcon />
  //     </SvgIcon>
  //   )
  // },
  // {
  //   title: 'Register',
  //   path: '/auth/register',
  //   icon: (
  //     <SvgIcon fontSize="small">
  //       <UserPlusIcon />
  //     </SvgIcon>
  //   )
  // },
  // {
  //   title: 'Error',
  //   path: '/404',
  //   icon: (
  //     <SvgIcon fontSize="small">
  //       <XCircleIcon />
  //     </SvgIcon>
  //   )
  // }
];
