import tkinter as tk
from pathlib import Path
from tkinter import Tk, Canvas, Entry, Button, PhotoImage, ttk
from datetime import datetime, timedelta

import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg

from library.Classes.cSalaEspera import *

# --------------------------Variables Globales---------------------------------

# -- Path's--
OUTPUT_PATH = Path(__file__).parent
ASSETS_PATH = OUTPUT_PATH / Path(
    r".\assets\frame0")

global Father_off_windows


# -- Imagenes de Bottones --
button_image_1 = None
button_image_2 = None
button_image_3 = None
button_image_4 = None

# ----- Ventanas -----
Ventana_aux = None
grafico_categorias_creado = False
canvas_grafico_pacientes_categorias_aux=None

grafico_sala_espera_creado = False
canvas_grafico_pacientes_sala_espera_aux=None
Tablas_pacientes_atendidos=None
Tabla_busqueda=None
# --- cSalaEspera ---
Sala_de_espera = cSalaEspera()

# --- entry's -----

# ------------------------------Metodosaccesorios--------------------
def relative_to_assets_menu_ingreso_guiado(path: str) -> Path:
    ASSETS_PATH = Path(r"C:\Users\Adri\Desktop\Triage_HF\library\GUI\Files_from_thinker_designer\build\assets\frame10") / path
    return ASSETS_PATH

def relative_to_assets_rojo(path: str) -> Path:
    ASSETS_PATH = Path(r"C:\Users\Adri\Desktop\Triage_HF\library\GUI\Files_from_thinker_designer\build\assets\frame4") / path
    return ASSETS_PATH


def relative_to_assets_amarillo(path: str) -> Path:
    ASSETS_PATH = Path(r"C:\Users\Adri\Desktop\Triage_HF\library\GUI\Files_from_thinker_designer\build\assets\frame6") / path
    return ASSETS_PATH


def relative_to_assets_naranja(path: str) -> Path:
    ASSETS_PATH = Path(r"C:\Users\Adri\Desktop\Triage_HF\library\GUI\Files_from_thinker_designer\build\assets\frame5") / path
    return ASSETS_PATH


def relative_to_assets_Verde(path: str) -> Path:
    ASSETS_PATH = Path(r"C:\Users\Adri\Desktop\Triage_HF\library\GUI\Files_from_thinker_designer\build\assets\frame7") / path
    return ASSETS_PATH


def relative_to_assets_Ingreso_ya_clasificado(path: str) -> Path:
    ASSETS_PATH = Path(r"C:\Users\Adri\Desktop\Triage_HF\library\GUI\Files_from_thinker_designer\build\assets\frame9")/ path
    return ASSETS_PATH
# ------------------------------ Ventanas ----------------------------
"""
def Abrir_menu_ingreso_datos_cargados(_window,tiempo,Numero_dolor,entry1,entry2):
    print("Boton generar paciente apretado")
    categoria = None

    if tiempo is None and Numero_dolor is None and entry2 is None and entry1 is None:
        categoria=""
    else:
        Numero_dolor = int(Numero_dolor.get())
        if 9 <= Numero_dolor <= 10 or tiempo == "ahora":
            categoria = "tipo 1"

        elif 7 <= Numero_dolor <= 8 or tiempo == "<24":
            categoria = "tipo 2"

        elif 3 <= Numero_dolor <= 6 or tiempo == "24-72":
            categoria = "tipo 3"

        elif 1 <= Numero_dolor <= 3 or tiempo == ">72":
            categoria = "tipo 5"

        else:
            categoria = ""

    global Father_off_windows
    if (_window == Father_off_windows):
        _window.destroy()  # destruyo la ventana anterior
    else:
        _window.destroy()
        Father_off_windows.destroy()
    Ingreso_ya_clasificado(categoria)
"""
"""
def Abrir_menu_ingreso_guiado(_window):
    print("Boton Ingreso Guiado Apretado")
    global Father_off_windows
    if _window == Father_off_windows:
        _window.destroy()  # destruyo la ventana anterior
    else:
        _window.destroy()
        Father_off_windows.destroy()
    Ingresar_paciente_con_guia()

"""
def Agregar_paciente_clasificado(nombre, color):
    Sala_de_espera.Pacientes_Clasificados(color, nombre, "18", "Unkown")


def Atender_paciente_clasificado(window):
    Sala_de_espera.DerivarProximo()
    Agregar_Grafico_Pacientes_en_sala(window)
    Agregar_grafico_pacientes_categorias(window)
    mostrar_datos(window)

def Clasificar_paciente_sin_clasificar(window):
    """
    Este metodo simula la llegada de un paciente random a la sala de espera
    este no fue categorizado
    :return:
    """

    # el Texto Hisotrial se tendría que buscar en la base de datos del hospital para poder mostrarle al
    # enfero del triage elementos relevantes
    paciente = Sala_de_espera.generar_Paciente_sin_gravedad("20", "", )
    Sala_de_espera.Pacientes_sin_Clasificar(paciente)
    Agregar_Grafico_Pacientes_en_sala(window)
    Agregar_grafico_pacientes_categorias(window)


def Agregar_Grafico_Pacientes_en_sala(window):
    global grafico_sala_espera_creado
    global canvas_grafico_pacientes_sala_espera_aux
    # Verificar si el gráfico ya ha sido creado
    if grafico_sala_espera_creado:
        # Si el gráfico ya existe, eliminarlo
        canvas_grafico_pacientes_sala_espera_aux.get_tk_widget().destroy()
    # Datos para el gráfico de barras
    pacientes = ['']

    pacientes_categorizados = len(Sala_de_espera.Lista_pacientes.Lista_de_colas) -4
    pacientes_sin_categorizar = len(Sala_de_espera.Sala_Espera)
    total = pacientes_categorizados +pacientes_sin_categorizar


    valores1 = [pacientes_sin_categorizar]
    valores2 = [pacientes_categorizados]

    # Crear una figura de Matplotlib
    fig = plt.Figure(figsize=(2, 5), dpi=100)
    ax = fig.add_subplot(111)

    # Personalizar los colores de las barras
    color1 = '#F3F3F3'
    color2 = '#37B3E2'
    bar_width = 0.20

    ax.bar(pacientes, valores1, width=bar_width, color=color1)
    ax.bar(pacientes, valores2, width=bar_width, color=color2, bottom=valores1)

    # Agregar una leyenda
    ax.legend(frameon=False)

    # Ocultar ejes y líneas de cuadrícula
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['bottom'].set_visible(False)
    ax.spines['left'].set_visible(False)
    ax.xaxis.set_ticks_position('none')
    ax.yaxis.set_ticks_position('none')

    # Establecer el límite del eje x para centrar la barra
    ax.set_xlim(-0.25, 0.15)
    # Desplazar el eje vertical hacia la derecha
    ax.spines['left'].set_position(('data', -0.1))
    # Definir las coordenadas del rectángulo
    x1, y1, x2, y2 = 277.0, 473.0, 378.0, 690.0

    # Obtener las dimensiones del rectángulo
    rect_width = x2 - x1
    rect_height = y2 - y1

    # Obtener el tamaño de la figura en función de las dimensiones del rectángulo
    fig_width = rect_width
    fig_height = rect_height

    canvas = FigureCanvasTkAgg(fig, master=window)
    # Posicionar el lienzo dentro del rectángulo
    canvas.get_tk_widget().place(x=x1, y=y1, width=fig_width, height=fig_height)

    canvas_grafico_pacientes_sala_espera_aux = canvas
    return canvas


def Agregar_grafico_pacientes_categorias(window):
    #Sala_de_espera.Lista_pacientes.Reorganizar_greedy()
    #La sigueinte porcion de cosigo es fea y bruta

    Cant_rojo= Sala_de_espera.Lista_pacientes.contar_pacientes_gravedad_tipo_1()
    Cant_naranja = Sala_de_espera.Lista_pacientes.contar_pacientes_gravedad_tipo_2()
    Cant_amarillo = Sala_de_espera.Lista_pacientes.contar_pacientes_gravedad_tipo_3()
    Cant_verde = Sala_de_espera.Lista_pacientes.contar_pacientes_gravedad_tipo_4()

    global grafico_categorias_creado
    global canvas_grafico_pacientes_categorias_aux
    # Verificar si el gráfico ya ha sido creado
    if grafico_categorias_creado:
        # Si el gráfico ya existe, eliminarlo
        canvas_grafico_pacientes_categorias_aux.get_tk_widget().destroy()

    # Datos para el gráfico de barras
    categorias = ['Tipo_1', 'Tipo_2', 'Tipo_3', 'Tipo_4']
    valores1 = [Cant_rojo, Cant_naranja, Cant_amarillo, Cant_verde]

    # Crear una figura de Matplotlib
    fig = plt.Figure(figsize=(5, 4), dpi=100)
    ax = fig.add_subplot(111)

    # Personalizar los colores de las barras
    colors = ["red", "orange", "yellow", "green", "blue"]
    bar_width = 0.35

    ax.bar(categorias, valores1, width=bar_width, color=colors, label='')

    # Agregar una leyenda
    ax.legend(frameon=False)
    # Ocultar ejes y líneas de cuadrícula
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['bottom'].set_visible(False)
    ax.spines['left'].set_visible(False)
    ax.xaxis.set_ticks_position('none')
    ax.yaxis.set_ticks_position('none')

    # Crear un lienzo para mostrar la figura en la ventana
    canvas = FigureCanvasTkAgg(fig, master=window)

    # ax.spines['left'].set_position(('data', -0.1))
    # Definir las coordenadas del rectángulo
    x1, y1, x2, y2 = 395.0, 476.0, 881.0, 690.0,

    # Obtener las dimensiones del rectángulo
    rect_width = x2 - x1
    rect_height = y2 - y1

    # Obtener el tamaño de la figura en función de las dimensiones del rectángulo
    fig_width = rect_width
    fig_height = rect_height

    canvas = FigureCanvasTkAgg(fig, master=window)
    # Posicionar el lienzo dentro del rectángulo
    canvas.get_tk_widget().place(x=x1, y=y1, width=fig_width, height=fig_height)
    canvas_grafico_pacientes_categorias_aux = canvas
    # Marcar que el gráfico ha sido creado
    grafico_creado = True


def clasificar(entry1,entry2,entry3,entry4,window):
    print("Button_8 clicked")
    if len(Sala_de_espera.Sala_Espera)>0:
        Sala_de_espera.Sala_Espera.pop(0)
    enty1=entry1.get()
    enty2 = entry2.get()
    enty3 = entry3.get()
    enty4 = entry4.get()
    print("entry1: " +entry1.get())
    print("entry2: " +entry2.get())
    print("entry3: " +entry3.get())
    print("entry4: " +entry4.get())
    entry1.insert(0, "")
    entry2.insert(0, "")
    entry3.insert(0, "")
    entry4.insert(0, "")

    caso_clinico=Sala_de_espera.Lista_pacientes.Handler.BusquedaUltimo()
    paciente = Sala_de_espera.generarPaciente(enty4,enty1,enty2,caso_clinico,Sala_de_espera.Lista_enfermeros_triage[0],enty3)
    Sala_de_espera.Lista_pacientes.insert(paciente)

    #chequeo si no tengo que mover a algun paciente de gravedad
    Sala_de_espera.Lista_pacientes.Reorganizar_greedy()

    Agregar_Grafico_Pacientes_en_sala(window)
    Agregar_grafico_pacientes_categorias(window)

def atender_manual_por_turno(window):
    print("Button_5 clicked")

    # Obtener la hora actual
    ahora = datetime.now().time()

    #la cantidad de enfemeros dependiente del turno
    enfermeros_dedicados=0

    # Determinar cuántos enfermeros están dedicados en este momento
    if (ahora >= datetime.strptime("23:00", "%H:%M").time() or ahora < datetime.strptime("6:00", "%H:%M").time()):
        enfermeros_dedicados = 1
    elif ahora < datetime.strptime("10:00", "%H:%M").time():
        enfermeros_dedicados = 2
    elif ahora < datetime.strptime("16:00", "%H:%M").time():
        enfermeros_dedicados = 5
    else:
        enfermeros_dedicados = 3

    # Llamar a la función atender la cantidad de veces correspondiente
    for i in range(enfermeros_dedicados):
        Atender_paciente_clasificado(window)

#para atender: usar def Atender_paciente_clasificado()

def Mostrar_datos_buscar_Hisotrial(fecha_nacimiento,nombre,Num_caso_clinico,window):

    #chequeo que no se haya hecho una busqueda en bano
    if (fecha_nacimiento.get() != "" or nombre.get() != "" or Num_caso_clinico.get() != ""):

        datos = Sala_de_espera.HandlerArchivos.buscar_paciente(nombre.get(),Num_caso_clinico.get())
        global Tabla_busqueda
        print("entry3: " + fecha_nacimiento.get())
        print("entry4: " + nombre.get())
        print("entry5: " + Num_caso_clinico.get())
        print("button_5 clicked")

        if (Tabla_busqueda is not None):
            Tabla_busqueda.destroy()
            Sala_de_espera.HandlerArchivos = cManejoArchivo()


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
        # Ajusta las coordenadas (x, y), ancho y alto
        tree.place(x=884, y=536.0, width=285, height=80)
        Tabla_busqueda = tree

        # Insertar los últimos datos en el Treeview
        for _, fila in datos.iterrows():
            valores = fila.values
            tree.insert("", "end", values=tuple(valores))


class cHandler():
    import tkinter as tk
    from tkinter import ttk


    class ListFrame(ttk.Frame):
        def __init__(self, parent, item_height):
            super().__init__(master=parent)
            self.pack(expand=True, fill='both')

            # widget data
            self.HandlerArchivos = cManejoArchivo()
            self.text_data = Sala_de_espera.HandlerArchivos.obtener_ultimos_datos()
            self.item_number = len(self.text_data)
            self.list_height = self.item_number * item_height

            # canvas
            self.canvas = tk.Canvas(self, background='red', scrollregion=(0, 0, self.winfo_width(), self.list_height))
            self.canvas.pack(expand=True, fill='both')

            # display frame and set the columns for adaptable interface
            self.frame = ttk.Frame(self)
            columnas = self.text_data.columns
            contador = 0
            frame = ttk.Frame(self.frame)
            for i in columnas:
                ttk.Label(frame, text=f'#{i}').grid(row=0, column=contador)
                contador=contador+1
                frame.pack(expand=True, fill='both', pady=4, padx=10)

            for _, fila in self.text_data.iterrows():
                valores = fila.values
                text=tuple(valores)
                self.Crear_Fila(_,fila).pack(expand = True, fill = 'both', pady =  4, padx = 10)
            # scrollbar
            self.scrollbar = ttk.Scrollbar(self, orient='vertical', command=self.canvas.yview)
            self.canvas.configure(yscrollcommand=self.scrollbar.set)
            self.scrollbar.place(relx=1, rely=0, relheight=1, anchor='ne')

            # events
            self.canvas.bind_all('<MouseWheel>',
                                 lambda event: self.canvas.yview_scroll(-int(event.delta / 60), "units"))
            self.bind('<Configure>', self.update_size)

        def actualizar_datos(self):
            self.text_data = Sala_de_espera.HandlerArchivos.obtener_ultimos_datos()
        def update_size(self, event):
            if self.list_height >= self.winfo_height():
                height = self.list_height
                self.canvas.bind_all('<MouseWheel>',
                                     lambda event: self.canvas.yview_scroll(-int(event.delta / 60), "units"))
                self.scrollbar.place(relx=1, rely=0, relheight=1, anchor='ne')
            else:
                height = self.winfo_height()
                self.canvas.unbind_all('<MouseWheel>')
                self.scrollbar.place_forget()

            self.canvas.create_window(
                (0, 0),
                window=self.frame,
                anchor='nw',
                width=self.winfo_width(),
                height=height)

        def Crear_Fila(self, index, item):
            frame = ttk.Frame(self.frame)

            # grid layout
            frame.rowconfigure(0, weight=1)
            cant_columnas = 8*2 #se duplican la cantidad de columnas (para que haya una en el medio y
                                # poder hacer de separador
            frame.columnconfigure((0,1,2, 3,4,5,6,7,8), weight=1, uniform='a')

            # widgets
            ttk.Label(frame, text=f'#{index}').grid(row=0, column=0)
            contador_columnas=0
            for i in item:
                #setings of
                ttk.Label(frame, text=f'{i}').grid(row=0, column=contador_columnas)
                contador_columnas=contador_columnas+1
            return frame

    # setup
    window = tk.Tk()
    window.geometry('500x400')
    window.title('Scrolling')

    list_frame = ListFrame(window, 100)

    # run
    window.mainloop()





def listaPrevia(window):
    global Tablas_pacientes_atendidos
    if(Tablas_pacientes_atendidos is not None):
        Tablas_pacientes_atendidos.destroy()
        Sala_de_espera.HandlerArchivos = cManejoArchivo()
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

    # Aplicar el estilo de línea azul a las filas de pacientes buscando cama
    tree.tag_configure("line_color", background="#37B3E2")
    tree.tag_configure("no_line", background="white")

    # Insertar los últimos datos en el Treeview
    for _, fila in ultimos_datos.iterrows():
        valores = fila.values
        tree.insert("", "end", values=tuple(valores))

    tree.grid(row=0, column=0, padx=10, pady=10)
    Tablas_pacientes_atendidos = tree

    scrollbar_table = ttk.Scrollbar(window, orient='vertical', command=tree.yview)
    tree.configure(yscrollcommand=scrollbar_table.set)
    scrollbar_table.place(relx=1, rely=0, relheight=1, anchor='ne')
    window = tk.Tk()
    listaPrevia(window)
    window.mainloop()


if __name__ == '__main__':
    cHandler()
