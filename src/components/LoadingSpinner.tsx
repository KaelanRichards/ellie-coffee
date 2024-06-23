import { CgCoffee } from 'react-icons/cg';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-40">
      <CgCoffee className="animate-spin text-brown-600 text-4xl" />
    </div>
  );
};

export default LoadingSpinner;
