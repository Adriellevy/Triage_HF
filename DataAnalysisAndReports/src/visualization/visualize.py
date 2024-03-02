import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import timedelta


def bar_chart(df, x, y, title, x_title, y_title, mean = None):
    fig = px.bar(df, x = x, y = y, barmode = "group")
    fig.update_layout(title = title, xaxis_title = x_title, yaxis_title = y_title, title_x = 0.5)
    fig.update_traces(texttemplate = '%{y}', textposition = 'outside')
    if(mean):
        mean = df[y].mean()
        fig.add_trace(go.Scatter(x = df[x],
                                 y = [mean] * len(df),
                                 mode = 'lines',
                                 name = 'Media',
                                 line = dict(color = 'red', width = 2, dash = 'dash'),
                                 hovertemplate = '%{y:.2f}'))
        fig.add_annotation(
        xref = 'paper', yref = 'y',
        x = -0.03, y = mean,
        text = f'{mean:.2f}',
        showarrow = False,
        font = dict(color = 'red'))
    return fig 

def get_last_week(df):
    end_date = df['FECHA DE INGRESO'].max()
    start_date = end_date - timedelta(days=6)
    return (start_date, end_date)

def filters(df, desde = None, hasta = None, nombre_y_apellido = None, motivo_de_consulta = None, box = None, triage = None, medico = None, enfermero = None, alta = None, aislado = None):
    if(desde == None and hasta == None):
        desde, hasta = get_last_week(df)
    else:
        desde = pd.to_datetime(desde, format = '%d-%m-%Y', errors = 'coerce') 
        hasta = pd.to_datetime(hasta, format = '%d-%m-%Y', errors = 'coerce')  

    df = df[(df['FECHA DE INGRESO'] >= desde) & (df['FECHA DE INGRESO'] <= hasta)]
    df['FECHA DE INGRESO'] = df['FECHA DE INGRESO'].dt.strftime('%d-%m-%Y')      
       
    if(nombre_y_apellido != None):
        df = df[df['NOMBRE Y APELLIDO'] == nombre_y_apellido.upper()]

    if(motivo_de_consulta != None):
        df = df[df['MOTIVO DE CONSULTA'] == motivo_de_consulta.upper()]

    if(box != None):
        df = df[df['BOX'] == box]

    if(triage != None):
        df = df[df['TRIAGE'] == triage]

    if(medico != None):
        df = df[df['MEDICO'] == medico.upper()]

    if(enfermero != None):
        df = df[df['ENFERMERO'] == enfermero.upper()]

    if(alta != None):
        df = df[df['ALTA'] == alta.upper()]

    if(aislado != None):
        df = df[df['AISLADO'] == aislado]

    return df

def cant_pacientes_fecha(df, desde = None, hasta = None, nombre_y_apellido = None, motivo_de_consulta = None, box = None, triage = None, medico = None, enfermero = None, alta = None, aislado = None):
    df = filters(df, desde, hasta, nombre_y_apellido, motivo_de_consulta, box, triage, medico, enfermero, alta, aislado)
    
    df = df.groupby('FECHA DE INGRESO', sort = False).size().reset_index()
    df.rename(columns={0: 'CANTIDAD DE PACIENTES'}, inplace = True)

    return df

def cant_pacientes_triage(df, desde = None, hasta = None, nombre_y_apellido = None, motivo_de_consulta = None, box = None, triage = None, medico = None, enfermero = None, alta = None, aislado = None):
    df = filters(df, desde, hasta, nombre_y_apellido, motivo_de_consulta, box, triage, medico, enfermero, alta, aislado)
    
    df = df.groupby('TRIAGE', sort = False).size().reset_index()
    df.rename(columns={0: 'CANTIDAD DE PACIENTES'}, inplace = True)

    return df

def top_consultas_fecha(df, top = 10, order = None, desde=None, hasta=None, nombre_y_apellido = None, motivo_de_consulta = None, box = None, triage = None, medico = None, enfermero = None, alta = None, aislado = None):
    df = filters(df, desde, hasta, nombre_y_apellido, motivo_de_consulta, box, triage, medico, enfermero, alta, aislado)

    count = df['MOTIVO DE CONSULTA'].value_counts()
    df = count.nlargest(top).reset_index()
    df.rename(columns={'count': 'CANTIDAD DE CONSULTAS'}, inplace = True)
    if order == 'asc':
        df.sort_values(by='CANTIDAD DE CONSULTAS', ascending = True, inplace = True)

    return df