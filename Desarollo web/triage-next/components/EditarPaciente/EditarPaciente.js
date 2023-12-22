import React from "react";

const MiPagina = () => {
  const handleClick = async () => {
    const headersList = {
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkRyLiBTbWl0aCIsImlhdCI6MTcwMzIwNjE1N30.TNYMTte4XaVExpZmUMgcoX_dzpBbt84QnyN81RsExiw",
      "Content-Type": "application/json",
    };
    try {
      // La información que quieres enviar en el cuerpo de la solicitud
      const data = {
        // ... tu información aquí ...
      };

      // Realiza la solicitud POST
      const response = await fetch("tu_url_de_destino", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json", // Ajusta el tipo de contenido según tus necesidades
          headers: headersList,
        },
        body: JSON.stringify(data),
      });

      // Verifica si la solicitud fue exitosa
      if (response.ok) {
        console.log("Solicitud POST exitosa");
        // Puedes realizar otras acciones aquí si es necesario
      } else {
        console.error("Error al realizar la solicitud POST");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      {/* Botón con la clase "MandarModificacion" y manejo del evento clic */}
      <button onClick={handleClick}>
        Actualizar
      </button>
    </div>
  );
};

export default MiPagina;
