import os
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI

def ask_agent(user_message: str, portfolio_context: str) -> str:
    api_key = os.getenv("TOGETHER_API_KEY")
    if not api_key:
        return (
            "Integracao de IA nao configurada. Defina TOGETHER_API_KEY "
            "para habilitar o chat FinanceAI."
        )

    model_name = os.getenv("TOGETHER_MODEL", "meta-llama/Llama-3-8b-chat-hf")
    base_url = os.getenv("TOGETHER_BASE_URL", "https://api.together.xyz/v1")

    system_prompt = (
        "Você é o assistente virtual FinanceAI, focado em interpretar carteiras de investimentos. "
        "Seja analítico, objetivo e responda sempre em português. "
        "Abaixo está o contexto atualizado do portfólio do usuário:\n"
        f"{portfolio_context}\n"
        "Com base nesse contexto, responda a pergunta do usuário de forma clara e profissional."
    )
    
    try:
        llm = ChatOpenAI(
            model=model_name,
            api_key=api_key,
            base_url=base_url,
            temperature=0.3,
        )

        response = llm.invoke(
            [
                SystemMessage(content=system_prompt),
                HumanMessage(content=user_message),
            ]
        )

        if isinstance(response.content, str):
            return response.content

        return str(response.content)
    except Exception as e:
        print(f"Erro na geração de IA (LangChain): {e}")
        return f"Desculpe, meus servidores de linguagem natural esbarraram num problema: {str(e)}"
