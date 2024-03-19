import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import timedelta

import features.build_features as bf

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
    to = df['ENTRY_TIME'].max()
    from_ = to - timedelta(days=7)
    return (from_, to)


def filters(df, from_=None, to=None, patient_name=None, patient_problem=None, box_type=None, doctor_username=None, nurse_username=None, discharged=None, isolated=None):
    if (from_ == None and to == None):
        from_, to = get_last_week(df)
    else:
        from_ = pd.to_datetime(from_, format='%d-%m-%Y', errors='coerce')
        to = pd.to_datetime(to, format='%d-%m-%Y', errors='coerce')

    df = df[(df['ENTRY_TIME'] >= from_) & (df['ENTRY_TIME'] <= to)]
    df['ENTRY_TIME'] = df['ENTRY_TIME'].dt.strftime('%d-%m-%Y')

    if (patient_name != None):
        df = df[df['PATIENT_NAME'] == patient_name.upper()]

    if (patient_problem != None):
        df = df[df['PATIENT_PROBLEM'] == patient_problem.upper()]

    if (box_type != None):
        df = bf.filter_box_type(df, box_type)

    if (doctor_username != None):
        df = bf.filter_doctor_username(df, box_type)

    if (nurse_username != None):
        df = bf.filter_nurse_username(df, nurse_username)

    if (discharged != None):
        df = bf.filter_discharged(df)

    if (isolated != None):
        df = bf.filter_isolated(df)

    return df


def number_patients_date(df, from_=None, to=None, patient_name=None, patient_problem=None, box_type=None, doctor_username=None, nurse_username=None, discharged=None, isolated=None):
    df = filters(df, from_, to, patient_name, patient_problem,
                 box_type, doctor_username, nurse_username, discharged, isolated)

    df = df.groupby(['ENTRY_TIME', 'PATIENT_TRIAGE_LEVEL'], sort=False).size(
    ).reset_index(name='NUMBER_OF_PATIENTS')

    df['PATIENT_TRIAGE_LEVEL'] = df['PATIENT_TRIAGE_LEVEL'].apply(lambda x: str(int(float(x))))
    df = df[df['PATIENT_TRIAGE_LEVEL'] != '0']

    return df


def top_queries_date(df, top=10, order=None, from_=None, to=None, patient_name=None, patient_problem=None, box_type=None, doctor_username=None, nurse_username=None, discharged=None, isolated=None):
    df = filters(df, from_, to, patient_name, patient_problem,
                 box_type, doctor_username, nurse_username, discharged, isolated)

    df = df.groupby(['PATIENT_PROBLEM', 'PATIENT_TRIAGE_LEVEL']).size(
    ).reset_index(name='CANTIDAD DE CONSULTAS')

    top_reasons = df.groupby('PATIENT_PROBLEM')[
        'CANTIDAD DE CONSULTAS'].sum().nlargest(top).index
    count = count[count['PATIENT_PROBLEM'].isin(top_reasons)]

    if (order == 'asc'):
        count = count.sort_values(by=['PATIENT_PROBLEM', 'PATIENT_TRIAGE_LEVEL'], key=lambda x: x.map(
            dict(zip(top_reasons, range(len(top_reasons))))))

    count = count.sort_values(by=['PATIENT_PROBLEM', 'PATIENT_TRIAGE_LEVEL'], key=lambda x: x.map(
        dict(zip(top_reasons[::-1], range(len(top_reasons))))))

    count['PATIENT_TRIAGE_LEVEL'] = count['PATIENT_TRIAGE_LEVEL'].apply(lambda x: str(int(float(x))))
    count = count[count['PATIENT_TRIAGE_LEVEL'] != '0']

    return count
