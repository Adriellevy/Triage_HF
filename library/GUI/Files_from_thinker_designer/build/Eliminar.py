import tkinter as tk
from tkinter import ttk
from Estadisticas import Ejecutar_estadisticas
from Main_menu_Ingreso_Guiado import Ejecutar_guiado


def cambiar_a_ventana1():
    global current_window
    current_window.destroy()
    current_window = Ejecutar_estadisticas()
    current_window.mainloop()


def cambiar_a_ventana2():
    global current_window
    current_window.destroy()
    current_window = Ejecutar_guiado()
    current_window.mainloop()


def Handler():
    root = tk.Tk()

    tab_control = ttk.Notebook(root)

    frame_1 = ttk.Frame(tab_control)
    frame_2 = ttk.Frame(tab_control)

    tab_control.add(frame_1, text="Vista 1")
    tab_control.add(frame_2, text="Vista 2")

    button1 = tk.Button(frame_1, text="Cambiar a Vista 2", command=cambiar_a_ventana2)
    button2 = tk.Button(frame_2, text="Cambiar a Vista 1", command=cambiar_a_ventana1)

    button1.pack()
    button2.pack()

    current_window = Ejecutar_guiado()

    tab_control.pack(expand=1, fill="both")

    root.mainloop()
    # VentanaRoja()


if __name__ == '__main__':
    # Handler()
    Ejecutar_guiado()
