from flask import Flask, request

from data.make_dataset import get_df
from features.build_features import build_features
from visualization.visualize import cant_pacientes_fecha
from visualization.visualize import bar_chart

app = Flask(__name__)

@app.route('/')
def grafico_cant_pacientes_fecha():
    df = get_df()
    df = build_features(df)

    desde = request.args.get('desde', default=None, type=str)
    hasta = request.args.get('hasta', default=None, type=str)
    nombre_y_apellido = request.args.get('nombreyapellido', default=None, type=str)
    if(nombre_y_apellido):
        nombre_y_apellido = nombre_y_apellido.upper()
    motivo_de_consulta = request.args.get('motivodeconsulta', default=None, type=str)
    if(motivo_de_consulta):
        motivo_de_consulta = motivo_de_consulta.upper()
    box = request.args.get('box', default=None, type=int)
    triage = request.args.get('triage', default=None, type=float)
    medico = request.args.get('medico', default=None, type=str)
    if(medico):
        medico = medico.upper()
    enfermero = request.args.get('enfermero', default=None, type=str)
    if(enfermero):
        enfermero = enfermero.upper()
    alta = request.args.get('alta', default=None, type=str)
    if(alta):
        alta = alta.upper()
    aislado = request.args.get('aislado', default=None, type=bool)

    print(f"desde: {desde}")
    print(f"hasta: {hasta}")
    print(f"nombre_y_apellido: {nombre_y_apellido}")
    print(f"motivo_de_consulta: {motivo_de_consulta}")
    print(f"box: {box}")
    print(f"triage: {triage}")
    print(f"medico: {medico}")
    print(f"enfermero: {enfermero}")
    print(f"alta: {alta}")
    print(f"aislado: {aislado}")


    df = cant_pacientes_fecha(df, desde, hasta, nombre_y_apellido, motivo_de_consulta, box, triage, medico, enfermero, alta, aislado)

    media = request.args.get('media', default=None, type=bool)

    # Dejar fijo
    fig = bar_chart(df = df, 
               x='FECHA DE INGRESO', y='CANTIDAD DE PACIENTES', 
               x_title='Fecha de Ingreso', y_title='Cantidad de Pacientes', title='Cantidad de Pacientes por Fecha de Ingreso', 
               mean = media)
    
    return fig.to_html()

if __name__ == '__main__':
    app.run(debug=True)