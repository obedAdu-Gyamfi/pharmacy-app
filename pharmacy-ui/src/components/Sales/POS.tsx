
import { Link } from 'react-router-dom'
import Layout from '../../layouts/RootLayout';
import { SalesStartCard } from './SalesStartCard';

export const POS = () => {

  return (
      <div className="grid pb-4 gap-4 grid-cols pt-4">
        <Link to="/sales" className="block text-blue-600"></Link>
        <SalesStartCard />
      </div>
  );
}



