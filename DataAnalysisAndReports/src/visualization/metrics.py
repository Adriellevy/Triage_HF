def calculate_total(df, y):
    return df[y].sum()

def calculate_mean(df, y):
    return df[y].mean()
    

def calculate_median(df, y):
    return df[y].median()

def calculate_max(df, y):
    return df[y].max()

def calculate_min(df, y):
    return df[y].min()

def calculate_min_x(df, x, y):
    return df.loc[df[y].idxmin(), x]

def calculate_max_x(df, x, y):
    return df.loc[df[y].idxmax(), x]

def total(txt, df_sum, y):
    return f'El total de {txt} fue de {calculate_total(df_sum, y)}'

def total_triage_I(txt, df, y, z):
    df = df[df[z] == 'Nivel I']
    return f'El total de {txt} de Nivel I fue de {calculate_total(df, y)}'

def total_triage_II(txt, df, y, z):
    df = df[df[z] == 'Nivel II']
    return f'El total de {txt} de Nivel II fue de {calculate_total(df, y)}'

def total_triage_III(txt, df, y, z):
    df = df[df[z] == 'Nivel III']
    return f'El total de {txt} de Nivel III fue de {calculate_total(df, y)}'

def total_triage_IV(txt, df, y, z):
    df = df[df[z] == 'Nivel IV']
    return f'El total de {txt} de Nivel IV fue de {calculate_total(df, y)}'

def mean(txt, df_sum, y):
    return f'La media de {txt} fue de {round(calculate_mean(df_sum, y), 2)}'

def mean_triage_I(txt, df, y, z):
    df = df[df[z] == 'Nivel I']
    return f'La media de {txt} de Nivel I fue de {round(calculate_mean(df, y), 2)}'    

def min(txt, df_sum, x, y):
    return f'El minimo de {txt} fue de {calculate_min(df_sum, y)} en la fecha {calculate_min_x(df_sum, x, y)}'

def max(txt, df_sum, x, y):
    return f'El maximo de {txt} fue de {calculate_max(df_sum, y)} en la fecha {calculate_max_x(df_sum, x, y)}'

def metrics_data(txt, df, x, y, z):
    df_sum = df.groupby(df[x])[y].sum().reset_index(name=y)
    return {
        'total': total(txt, df_sum, y),
        'total_triage_I': total_triage_I(txt, df, y, z),
        'total_triage_II': total_triage_II(txt, df, y, z),
        'total_triage_III': total_triage_III(txt, df, y, z),
        'total_triage IV': total_triage_IV(txt, df, y, z),
        'mean': mean(txt, df_sum, y),
        'mean_triage_I': mean_triage_I(txt, df, y, z),
        # 'mean_triage_II': mean_triage_II(),
        # 'mean_triage_III': mean_triage_III(),
        # 'mean_triage_IV': mean_triage_IV(),
        'min': min(txt, df_sum, x, y),
        'max': max(txt, df_sum, x, y)
    }
