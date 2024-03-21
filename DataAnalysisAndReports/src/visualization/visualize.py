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


def bar_chart(df, x, y, title, x_title, y_title, color, mean=None):
    df_sum = df.groupby(x)[y].sum().reset_index(name=y)

    fig = px.bar(df,
                 x=x,
                 y=y,
                 color=color,
                 category_orders={x: df[x].unique()},
                 color_discrete_map={'1': '#BDBEBE', '2': '#FA8162', '3': '#CCCC52', '4': '#A0C791'})

    fig.update_layout(title=title,
                      xaxis_title=x_title,
                      yaxis_title=y_title,
                      title_x=0.5,
                      plot_bgcolor='white',
                      xaxis=dict(linecolor='black', showgrid=True),
                      yaxis=dict(linecolor='black', showgrid=True),
                      legend=dict(traceorder='reversed'))
    if (mean):
        mean = df_sum[y].mean()
        fig.add_trace(go.Scatter(x=df_sum[x],
                                 y=[mean] * len(df_sum),
                                 mode='lines',
                                 name='Mean',
                                 line=dict(color='red', width=2, dash='dash'),
                                 hovertemplate='%{y:.2f}'))
    return fig


def line_chart(df, x, y, title, x_title, y_title, color, mean=None):
    df_sum = df.groupby(x)[y].sum().reset_index(name=y)
    fig = px.line(df,
                  x=x,
                  y=y,
                  color=color,
                  markers=True,
                  color_discrete_map={'1': '#BDBEBE', '2': '#FA8162', '3': '#CCCC52', '4': '#A0C791'})
    fig.update_layout(title=title,
                      xaxis_title=x_title,
                      yaxis_title=y_title,
                      title_x=0.5,
                      plot_bgcolor='white',
                      xaxis=dict(linecolor='black', showgrid=True),
                      yaxis=dict(linecolor='black', showgrid=True))
    if (mean):
        mean = df_sum[y].mean()
        fig.add_trace(go.Scatter(x=df_sum[x],
                                 y=[mean] * len(df_sum),
                                 mode='lines',
                                 name='Mean',
                                 line=dict(color='red', width=2, dash='dash'),
                                 hovertemplate='%{y:.2f}'))
    return fig


def get_last_week(df):
    to = df['FECHA DE INGRESO'].max()
    from_ = to - timedelta(days=7)
    return (from_, to)


def filters(df, from_=None, to=None, name_lastname=None, consulting_reason=None, box=None, doctor=None, nurse=None, discharged=None, isolated=None):
    if (from_ == None and to == None):
        from_, to = get_last_week(df)
    else:
        from_ = pd.to_datetime(from_, format='%d-%m-%Y', errors='coerce')
        to = pd.to_datetime(to, format='%d-%m-%Y', errors='coerce')

    df = df[(df['FECHA DE INGRESO'] >= from_) & (df['FECHA DE INGRESO'] <= to)]
    df['FECHA DE INGRESO'] = df['FECHA DE INGRESO'].dt.strftime('%d-%m-%Y')


    if (name_lastname != None):
        df = df[df['NOMBRE Y APELLIDO'] == name_lastname.upper()]

    if (consulting_reason != None):
        df = df[df['MOTIVO DE CONSULTA'] == consulting_reason.upper()]

    if (box != None):
        df = df[df['BOX'] == box]

    if (doctor != None):
        df = df[df['MEDICO'] == doctor.upper()]

    if (nurse != None):
        df = df[df['ENFERMERO'] == nurse.upper()]

    if (discharged != None):
        df = df[df['ALTA'] == discharged.upper()]

    if (isolated != None):
        df = df[df['AISLADO'] == isolated]

    return df


def number_patients_date(df, from_=None, to=None, name_lastname=None, consulting_reason=None, box=None, doctor=None, nurse=None, discharged=None, isolated=None):
    df = filters(df, from_, to, name_lastname, consulting_reason,
                 box, doctor, nurse, discharged, isolated)

    df = df.groupby(['FECHA DE INGRESO', 'TRIAGE'], sort=False).size(
    ).reset_index(name='CANTIDAD DE PACIENTES')

    df['TRIAGE'] = df['TRIAGE'].apply(lambda x: str(int(float(x))))
    df = df[df['TRIAGE'] != '0']

    return df


def top_queries_date(df, top=10, order=None, from_=None, to=None, name_lastname=None, consulting_reason=None, box=None, doctor=None, nurse=None, discharged=None, isolated=None):
    df = filters(df, from_, to, name_lastname, consulting_reason,
                 box, doctor, nurse, discharged, isolated)

    df = df.groupby(['MOTIVO DE CONSULTA', 'TRIAGE']).size(
    ).reset_index(name='CANTIDAD DE CONSULTAS')

    top_reasons = df.groupby('MOTIVO DE CONSULTA')[
        'CANTIDAD DE CONSULTAS'].sum().nlargest(top).index
    count = df[df['MOTIVO DE CONSULTA'].isin(top_reasons)]

    if (order == 'asc'):
        count = count.sort_values(by=['MOTIVO DE CONSULTA', 'TRIAGE'], key=lambda x: x.map(
            dict(zip(top_reasons, range(len(top_reasons))))))

    count = count.sort_values(by=['MOTIVO DE CONSULTA', 'TRIAGE'], key=lambda x: x.map(
        dict(zip(top_reasons[::-1], range(len(top_reasons))))))

    count['TRIAGE'] = count['TRIAGE'].apply(lambda x: str(int(float(x))))
    count = count[count['TRIAGE'] != '0']

    return count
