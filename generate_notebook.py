import nbformat as nbf
import os

# Create notebook directory if it doesn't exist
os.makedirs("notebook", exist_ok=True)

nb = nbf.v4.new_notebook()

# 1. Introduction Markdown
header_md = """# 📊 FinanceAI Predictor: Laboratório de Análise e Machine Learning
Este notebook é uma versão interativa de estudos exploratórios que detalha a Engenharia Matemática, Cálculos de Volatilidade e os Modelos de *Machine Learning* Preditivos desenvolvidos no Dashboard do projeto."""

# 2. Cell: Setup and Database load
code_setup = """import sqlite3
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
import math

sns.set_theme(style="darkgrid")
plt.rcParams['figure.figsize'] = (10, 5)

# Conectando ao Banco de Dados SQLite nativo do Backend
conn = sqlite3.connect('../financeai.db')
query = "SELECT * FROM assets"
df_assets = pd.read_sql(query, conn)
display(df_assets.head())
"""

# 3. Time Machine Markdown
md_timemachine = """## ⏳ 1. A Evolução Retroativa do Preço até 2018
Nosso Dashboard constrói os gráficos voltando no tempo através de uma função interpoladora. Para evitar que os pontos gráficos quebrem de forma "dura" durante os anos de histórico, o algoritmo FrontEnd em Javascript calcula o percentual de tempo (`progress = 1 - (daysAgo / maxDays)`) e aplica a curva de *Smooth Step* Matemática:  
`smooth = progresso * progresso * (3 - 2 * progresso)`"""

# 4. Time Machine Code
code_timemachine = """# O que a Interface Visual (Javascript) faz por debaixo dos panos matematicamente:
dias_totais = 2900 # Aprox 8 anos (2018 - 2026)
dias = np.linspace(dias_totais, 0, 100) # Do passado para o hoje

# Cálculo Seco Progressão Linear
progresso = 1 - (dias / dias_totais)
# Cálculo com Interpolação Smooth
smooth = progresso * progresso * (3 - 2 * progresso)

plt.plot(dias, progresso, label="Preço Linear (Seco)", linestyle="--")
plt.plot(dias, smooth, label="Preço Curva Smooth do Dashboard", linewidth=3, color="green")
plt.gca().invert_xaxis() # O passado fica a esquerda
plt.title("Efeito do Smooth Step no Histórico do Gráfico do FinanceAI")
plt.xlabel("Dias Atrás (Em relação ao Presente na Direita)")
plt.ylabel("Multiplicador de Crescimento Patrimonial")
plt.legend()
plt.show()
"""

# 5. Smart Portfolio Scatter Markdown
md_scatter = """## 🎯 2. Matriz de Inteligência (Retorno x Risco)
A tela de "Smart Portfolio" mapeia suas ações em um gráfico de Risco *versus* Rentabilidade. O risco das ações individuais é classificado via desvio e os retornos ditam sua atratividade. A "Razão de Sharpe" é o princípio de que o ativo vale a pena se o Retorno é mais alto que a exposição ao Risco."""

code_scatter = """# Simulando os dados do Smart Portfolio plotados no Frontend
np.random.seed(42)

# Gerando papéis de investimento randômicos: Risco (x), Retorno(y)
smart_df = pd.DataFrame({
    'Ativo': ['ITUB4', 'BBAS3', 'WEGE3', 'TESOURO SELIC', 'LCI ITAU', 'AAPL', 'MSFT'],
    'Risco_EixoX': [3.5, 4.0, 5.2, 0.5, 0.2, 4.5, 5.0],
    'Retorno_EixoY': [15.2, 22.0, 18.5, 8.5, 9.2, 25.0, 30.0],
    'Recomendacao': ['manter', 'compra', 'manter', 'compra', 'compra', 'venda', 'manter']
})

cores = {'compra': 'green', 'manter': '#FFA500', 'venda': 'red'}

sns.scatterplot(
    data=smart_df, 
    x='Risco_EixoX', 
    y='Retorno_EixoY', 
    hue='Recomendacao',
    palette=cores,
    s=150
)

# Adicionando Labels
for i, row in smart_df.iterrows():
    plt.annotate(row['Ativo'], (row['Risco_EixoX'] + 0.1, row['Retorno_EixoY']))

plt.title("Radar de Ações (Volatilidade vs Rentabilidade)")
plt.xlabel("RISCO (Volatilidade/Desvio)")
plt.ylabel("RENTABILIDADE (Oportunidade Percentual)")
plt.axvline(x=3.0, color='gray', linestyle='--', alpha=0.5)
plt.axhline(y=12.0, color='gray', linestyle='--', alpha=0.5)
plt.show()
"""

md_machinelearning = """## 🧠 3. Modelo Preditivo do Backend (Z-Score)
O arquivo `backend/services/ai_service.py` injeta um modelo preditivo para cada consulta feita pelo Fast API. Analisando a **Média Móvel** do mercado somado ou diminuído por 1 **Desvio Padrão**, nós geramos um radar. Quando uma Ação cai abaixo da Banda inferior (preço distante e super descontado sobre o histórico de 60 dias), o *Z-Score* emite a recomendação `"compra"`. """

code_machinelearning = """# Recriando o cálculo do backend/ai_service.py para visualização

historico_dias = 60
dias = np.arange(historico_dias)

# Gerando histórico falso de uma Ação que oscila como ondas num mercado tendencioso.
precos_base = 50 + 10 * np.sin(dias / 4.0) + dias * 0.2
ruido = np.random.normal(0, 2, historico_dias)
historico_cotacoes = precos_base + ruido

# Funções do Machine Learning (Ai_Service)
media_movel = np.mean(historico_cotacoes)

# Volatilidade (Variância -> Desvio)
variancia = sum((x - media_movel) ** 2 for x in historico_cotacoes) / len(historico_cotacoes)
desvio_padrao = math.sqrt(variancia)
preco_atual = historico_cotacoes[-1]

# Cálculo das Bandas de Risco
banda_superior = media_movel + (desvio_padrao * 1.5)
banda_inferior = media_movel - (desvio_padrao * 1.5)

print(f"Média: R${media_movel:.2f} | Desvio de Mercado: R${desvio_padrao:.2f}")
if preco_atual < banda_inferior:
    print(f"SINAL DE REDE NEURAL: COMPRA! Ativo está descontadissimo (R${preco_atual:.2f})")
elif preco_atual > banda_superior:
     print(f"SINAL DE REDE NEURAL: VENDA! Ativo está supercaro / Bolha de Curto prazo (R${preco_atual:.2f})")
else:
     print(f"SINAL DE REDE NEURAL: MANTER. Preço transitando dentro da normalidade gráfica.")

plt.plot(dias, historico_cotacoes, label="Cotação Histórica Diária (60d)", color="blue")
plt.axhline(media_movel, color="white", linestyle="--", label="Média Equilíbrio")
plt.axhline(banda_superior, color="red", alpha=0.3, label="Extremo de Sobre-Compra (+ Z-Score)", linewidth=10)
plt.axhline(banda_inferior, color="green", alpha=0.3, label="Extremo de Sobre-Venda (- Z-Score)", linewidth=10)

plt.scatter(dias[-1], preco_atual, color="yellow", s=100, zorder=5, label="HOJE")
plt.title("Modelo Preditivo Z-Score vs Bandas Próprias (AI Service)")
plt.legend()
plt.show()
"""

# Append cells to notebook
nb['cells'] = [
    nbf.v4.new_markdown_cell(header_md),
    nbf.v4.new_code_cell(code_setup),
    nbf.v4.new_markdown_cell(md_timemachine),
    nbf.v4.new_code_cell(code_timemachine),
    nbf.v4.new_markdown_cell(md_scatter),
    nbf.v4.new_code_cell(code_scatter),
    nbf.v4.new_markdown_cell(md_machinelearning),
    nbf.v4.new_code_cell(code_machinelearning)
]

# Write out the notebook package
with open('notebook/financeai_analise.ipynb', 'w', encoding='utf-8') as f:
    nbf.write(nb, f)
    
print("Notebook gerado em notebook/financeai_analise.ipynb")
