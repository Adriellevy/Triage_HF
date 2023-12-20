// Archivo: components/AbrirIngreso.js

import Link from 'next/link';

const AbrirIngreso = () => {
  return (
    <span className="pacientes-text">
      <Link href="../../estacionescotidianediad">
        <a>Ingreso Guiado</a>
      </Link>
    </span>
  );
};

export default AbrirIngreso;