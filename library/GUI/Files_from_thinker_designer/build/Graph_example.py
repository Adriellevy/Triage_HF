import tkinter as tk
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg

# Crear una ventana
ventana = tk.Tk()
ventana.title("Gráfico de Barras Superpuestas")
# Datos para el gráfico de barras
categorias = ['Rojo', 'Naranja', 'Amarillo', 'Verde', 'Azul']
valores1 = [1, 2, 0, 3, 5]

# Crear una figura de Matplotlib
fig = plt.Figure(figsize=(5, 4), dpi=100)
ax = fig.add_subplot(111)

# Personalizar los colores de las barras
colors = ["red","orange","yellow","green","blue"]
bar_width = 0.35

ax.bar(categorias, valores1, width=bar_width, color=colors, label='')

# Agregar una leyenda
ax.legend()
# Ocultar ejes y líneas de cuadrícula
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
ax.spines['bottom'].set_visible(False)
ax.spines['left'].set_visible(False)
ax.xaxis.set_ticks_position('none')
ax.yaxis.set_ticks_position('none')

# Crear un lienzo para mostrar la figura en la ventana
canvas = FigureCanvasTkAgg(fig, master=ventana)
canvas.get_tk_widget().pack()

# Función para cerrar la ventana
def cerrar_ventana():
    ventana.destroy()

# Crear un botón para cerrar la ventana
boton_cerrar = tk.Button(ventana, text="Cerrar", command=cerrar_ventana)
boton_cerrar.pack()

# Iniciar el bucle principal
ventana.mainloop()
