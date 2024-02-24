import pandas as pd
import plotly.express as px
import plotly.graph_objects as go


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

def filters(df, desde = None, hasta = None, nombre_y_apellido = None, motivo_de_consulta = None, box = None, triage = None, medico = None, enfermero = None, alta = None, aislado = None):
    if(desde != None and hasta != None):
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
    df_acotado = filters(df, desde, hasta, nombre_y_apellido, motivo_de_consulta, box, triage, medico, enfermero, alta, aislado)
    df_acotado = df_acotado.groupby('FECHA DE INGRESO', sort = False).size().reset_index()
    df_acotado.rename(columns={0: 'CANTIDAD DE PACIENTES'}, inplace = True)
    return df_acotado