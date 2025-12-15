import React from 'react'
import { Outlet } from 'react-router-dom'

export const ProductsPage = () => {
  return (
    <>
    <h1> Welcome to the Product Page</h1>
      <Outlet />
    </>
  );
}
