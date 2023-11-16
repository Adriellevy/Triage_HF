import tkinter as tk
from tkinter import ttk

def on_select(event):
    selected_value.set(selected_number.get())

# Crear la ventana principal
root = tk.Tk()
root.title("Lista Desplegable")

# Variable para almacenar el número seleccionado
selected_number = tk.StringVar()

# Lista de números del 1 al 10
numbers = list(range(1, 11))

# Crear la lista desplegable
dropdown = ttk.Combobox(root, textvariable=selected_number, values=numbers, state="readonly")
dropdown.bind("<<ComboboxSelected>>", on_select)
dropdown.grid(row=0, column=0, padx=10, pady=10)

# Variable para almacenar el valor seleccionado
selected_value = tk.StringVar()

# Etiqueta para mostrar el valor seleccionado
label = tk.Label(root, textvariable=selected_value)
label.grid(row=1, column=0, padx=10, pady=10)

# Establecer el valor predeterminado de la lista desplegable
dropdown.set("Seleccionar número")

# Iniciar el bucle principal
root.mainloop()
