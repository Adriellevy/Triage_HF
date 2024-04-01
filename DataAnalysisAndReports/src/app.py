from flask import Flask, request, Response, jsonify

import data.make_dataset as md

import features.build_features as bf

import visualization.visualize as vl
import visualization.metrics as mt


# TOD0S LOS CHARTS
# ANIMACIONES AL APARACER LOS GRAFICOS
# LAS LINEAS PUNTEADAS DE LA MEDIA DEBEN OCUPAR TOD0 EL GRAFICO
# AGREGAR PARA QUE EL NUMERO DE LA MEDIA QUEDE ALINEADO CON EL EJE DE REFERENCIAS DE "Y"

# BARCHARTS
# ORDENAR CORRECTAMENTE LOS NIVELES DE TRIAGE PARA CUALQUIER FECHA -- SOLUCIONADO (EN TEORIA)
# AL EGIR QULEE NIVELES DE TRIAGE MOSTRAR, ORDENAR AUTOMATICAMENTE
# MODIFICAR TEXT TRACE TEMPLATE

# LINECHARTS
# AJUSTAR ANCHO DE LINEA

# GENERAL
# -AGREGAR EVENTO DE CLIC EN GRAFICOS




app = Flask(__name__)
app.config['JSON_SORT_KEYS'] = False


def get_args():
    """
    from_ format: yyyy-mm-dd
    to format: yyyy-mm-dd
    """
    args = {'from_': request.args.get('from', default=None, type=str),
            'to': request.args.get('to', default=None, type=str),
            'patient_name': request.args.get('patientname', default=None, type=str),
            'patient_symptom': request.args.get('patientsymptom', default=None, type=str),
            'box_type': request.args.get('boxtype', default=None, type=int),
            'doctor_username': request.args.get('doctorusername', default=None, type=str),
            'nurse_username': request.args.get('nurseusername', default=None, type=str),
            'discharged': request.args.get('discharged', default=None, type=str),
            'isolated': request.args.get('isolated', default=None, type=bool)
            }
    return args

@app.route('/number_patients_date/')
def chart_number_patients_date():
    df = md.get_table('Patient')

    if (df.empty):
        return Response(status=204)
    
    df = bf.build_features(df, **get_args())
    
    df = bf.build_number_patients_date(df)
    
    mean = request.args.get('mean', default=None, type=bool)
    
    fig = vl.line_chart(df=df,
                     x='patient_entry_time',
                     y='number_of_patients',
                     x_title='Fecha de Ingreso',
                     y_title='Cantidad de Pacientes',
                     title='Cantidad de Pacientes por Fecha de Ingreso',
                     color='patient_triage_level',
                     mean=mean)

    return fig.to_html()

@app.route('/number_patients_date/metrics/')
def metrics_number_patients_date():
    df = md.get_table('Patient')

    if (df.empty):
        return Response(status=204)
    
    df = bf.build_features(df, **get_args())
    
    df = bf.build_number_patients_date(df)
    
    data = mt.metrics_data(df=df,
                          x='patient_entry_time',
                          y='number_of_patients',
                          txt_x='fecha de ingreso',
                          txt_y='pacientes')
    return jsonify(data)


@app.route('/top_queries_date/')
def chart_top_queries_date():
    df = md.get_table('Patient')

    if (df.empty):
        return Response(status=204)
    
    df = bf.build_features(df, **get_args())
    
    top = request.args.get('top', default=10, type=int)
    order = request.args.get('order', default=None, type=str)   
     
    df = bf.build_top_queries_date(df, top, order)
    
    mean = request.args.get('mean', default=None, type=bool)
    
    fig = vl.bar_chart(df=df,
                    x='patient_symptom',
                    y='symptom_count',
                    x_title='Motivo de Consulta',
                    y_title='Cantidad de Consultas',
                    title='Motivos de Consulta mas Frecuentes',
                    color='patient_triage_level',
                    mean=mean)

    return fig.to_html()


if __name__ == '__main__':
    app.run(debug=True)
