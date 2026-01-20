from pydantic_ai import Agent
# 1. Import OpenAIModel and the new OpenAIProvider
try:
    from pydantic_ai.models.openai import OpenAIModel
    from pydantic_ai.providers.openai import OpenAIProvider
except ImportError:
    # Fallback for some versions, though unlikely needed now
    from pydantic_ai.models.openai import OpenAIChatModel as OpenAIModel
    from pydantic_ai.providers.openai import OpenAIProvider

from models import DecisionInput, DecisionOutput
import os

# 2. Configure the model using the Provider (The New Way)
# We map OpenRouter config to the OpenAI provider
model = OpenAIModel(
    'meta-llama/llama-3.1-8b-instruct',
    provider=OpenAIProvider(
        base_url='https://openrouter.ai/api/v1',
        api_key=os.getenv('OPENROUTER_API_KEY')
    )
)

# 3. Initialize Agent
agent = Agent(
    model=model,
    system_prompt=(
        "You are a decision-clarifying assistant.\n"
        "Your job is to help users choose between options.\n"
        "Be decisive, clear, and practical.\n"
        "Never hedge without concluding.\n"
        "Acknowledge uncertainty but still recommend.\n"
        "Trade-offs must describe the downsides or compromises of the chosen recommendation.\n"
        "Do NOT repeat the user's constraints verbatim.\n"
        "The recommendation must be a plain human-readable sentence, not a list, index, or structured artifact.\n"
        "The confidence_score MUST be an integer between 1 and 10.\n"
        "Return structured output only."
    ),
    retries=2
)

async def run_decision_agent(input: DecisionInput) -> DecisionOutput:
    # 4. Pass output_type (previously result_type) in run()
    response = await agent.run(
        f"""
Decision: {input.decision}

Options:
{chr(10).join(f"- {o}" for o in input.options)}

Constraints:
{input.constraints or "None"}

Urgency: {input.urgency}
""",
        result_type=DecisionOutput
    )
    
    return response.data
