import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import timedelta

    # AJUSTAR VALOR DE 'x'
    # fig.add_annotation(
    # xref = 'x', yref = 'y',
    # x = -0.5, y = mean,
    # text = f'{mean:.2f}',
    # showarrow = False,
    # font = dict(color = 'red'))

def bar_chart(df, x, y, title, x_title, y_title, color, mean = None):
    df_sum = df.groupby(x)[y].sum().reset_index(name=y)

    fig = px.bar(df, 
                 x = x, 
                 y = y, 
                 color = color, 
                 category_orders={x: df[x].unique()}, 
                 color_discrete_map={'1': '#BDBEBE', '2': '#FA8162', '3': '#FAFB9F','4': '#A0C791'})
    
    fig.update_layout(title = title, 
                      xaxis_title = x_title, 
                      yaxis_title = y_title, 
                      title_x = 0.5, 
                      plot_bgcolor='white', 
                      xaxis=dict(linecolor='black', showgrid=True), 
                      yaxis=dict(linecolor='black', showgrid=True), 
                      legend=dict(traceorder='reversed'))
    if(mean):
        mean = df_sum[y].mean()
        fig.add_trace(go.Scatter(x = df_sum[x],
                                 y = [mean] * len(df_sum),
                                 mode = 'lines',
                                 name = 'Media',
                                 line = dict(color = 'red', width = 2, dash = 'dash'),
                                 hovertemplate = '%{y:.2f}'))
    return fig 

def line_chart(df, x, y, title, x_title, y_title, color, mean = None):
    df_sum = df.groupby(x)[y].sum().reset_index(name=y)
    fig = px.line(df, 
                  x = x, 
                  y = y,
                  color = color, 
                  markers = True,
                  color_discrete_map={'1': '#BDBEBE', '2': '#FA8162', '3': '#FAFB9F','4': '#A0C791'})
    fig.update_layout(title = title, 
                      xaxis_title = x_title, 
                      yaxis_title = y_title, 
                      title_x = 0.5, 
                      plot_bgcolor='white', 
                      xaxis=dict(linecolor='black', showgrid=True), 
                      yaxis=dict(linecolor='black', showgrid=True))
    if(mean):
        mean = df_sum[y].mean()
        fig.add_trace(go.Scatter(x = df_sum[x],
                                 y = [mean] * len(df_sum),
                                 mode = 'lines',
                                 name = 'Media',
                                 line = dict(color = 'red', width = 2, dash = 'dash'),
                                 hovertemplate = '%{y:.2f}'))
    return fig 


def get_last_week(df):
    end_date = df['FECHA DE INGRESO'].max()
    start_date = end_date - timedelta(days=7)
    return (start_date, end_date)

def filters(df, desde = None, hasta = None, nombre_y_apellido = None, motivo_de_consulta = None, box = None, medico = None, enfermero = None, alta = None, aislado = None):
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

    if(medico != None):
        df = df[df['MEDICO'] == medico.upper()]

    if(enfermero != None):
        df = df[df['ENFERMERO'] == enfermero.upper()]

    if(alta != None):
        df = df[df['ALTA'] == alta.upper()]

    if(aislado != None):
        df = df[df['AISLADO'] == aislado]

    return df

def cant_pacientes_fecha(df, desde = None, hasta = None, nombre_y_apellido = None, motivo_de_consulta = None, box = None, medico = None, enfermero = None, alta = None, aislado = None):
    df = filters(df, desde, hasta, nombre_y_apellido, motivo_de_consulta, box, medico, enfermero, alta, aislado)
    
    df = df.groupby(['FECHA DE INGRESO', 'TRIAGE'], sort = False).size().reset_index(name='CANTIDAD DE PACIENTES')

    df['TRIAGE'] = df['TRIAGE'].apply(lambda x: str(int(float(x))))
    df = df[df['TRIAGE'] != '0']

    return df

def top_consultas_fecha(df, top=10, order=None, desde=None, hasta=None, nombre_y_apellido=None, motivo_de_consulta=None, box=None, medico=None, enfermero=None, alta=None, aislado=None):
    df = filters(df, desde, hasta, nombre_y_apellido, motivo_de_consulta, box, medico, enfermero, alta, aislado)

    count = df.groupby(['MOTIVO DE CONSULTA', 'TRIAGE']).size().reset_index(name='CANTIDAD DE CONSULTAS')

    top_motivos = count.groupby('MOTIVO DE CONSULTA')['CANTIDAD DE CONSULTAS'].sum().nlargest(top).index
    count = count[count['MOTIVO DE CONSULTA'].isin(top_motivos)] 

    if(order == 'asc'):
        count = count.sort_values(by=['MOTIVO DE CONSULTA', 'TRIAGE'], key=lambda x: x.map(dict(zip(top_motivos, range(len(top_motivos))))))

    count = count.sort_values(by=['MOTIVO DE CONSULTA', 'TRIAGE'], key=lambda x: x.map(dict(zip(top_motivos[::-1], range(len(top_motivos))))))

    count['TRIAGE'] = count['TRIAGE'].apply(lambda x: str(int(float(x))))
    count = count[count['TRIAGE'] != '0']

    return count