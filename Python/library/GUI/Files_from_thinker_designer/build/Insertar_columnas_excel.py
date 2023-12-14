import sys
from tkinter import ttk
import tkinter as tk

sys.path.insert(1,r"C:\Users\Adri\Desktop\Laboratorio de programacion 2\Triage\Classes")
from Classes.cSalaEspera import *

Sala_de_espera = cSalaEspera()
def mostrar_datos(window):
    ultimos_datos = Sala_de_espera.HandlerArchivos.obtener_ultimos_datos()

    window.title("Últimos Datos")

    tree = ttk.Treeview(window, columns=(
    "Nombre", "Edad", "Gravedad", "Historial", "Enfermero", "Fecha", "CasoClinico", "Matricula"), show="headings")
    tree.heading("Nombre", text="Nombre")
    tree.heading("Edad", text="Edad")
    tree.heading("Gravedad", text="Gravedad")
    tree.heading("Historial", text="Historial")
    tree.heading("Enfermero", text="Enfermero")
    tree.heading("Fecha", text="Fecha")
    tree.heading("CasoClinico", text="Caso Clinico")
    tree.heading("Matricula", text="Matricula")

    for _, fila in ultimos_datos.iterrows():
        valores = fila.values
        tree.insert("", "end", values=tuple(valores))

    tree.grid(row=0, column=0, padx=10, pady=10)
    tree.place(x=894, y=476, width=372, height=len(ultimos_datos) * 30)


# Ejemplo de uso:
root = tk.Tk()
mostrar_datos(root)
root.mainloop()