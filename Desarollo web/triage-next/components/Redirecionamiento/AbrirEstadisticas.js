// Archivo: components/AbrirIngreso.js

import Link from 'next/link';

const AbrirIngreso = () => {
  return (
    <span className="pacientes-text">
      <Link href="../../estadisticas">
        <a>Estadisticas</a>
      </Link>
    </span>
  );
};

export default AbrirIngreso;