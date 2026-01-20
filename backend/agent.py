from pydantic_ai import Agent
# Use the modern import for the OpenAI model wrapper
try:
    from pydantic_ai.models.openai import OpenAIModel
except ImportError:
    from pydantic_ai.models.openai import OpenAIChatModel as OpenAIModel

from models import DecisionInput, DecisionOutput
import os

# 1. Setup the model with the API Key
model = OpenAIModel(
    'meta-llama/llama-3.1-8b-instruct',
    base_url='https://openrouter.ai/api/v1',
    api_key=os.getenv('OPENROUTER_API_KEY')
)

agent = Agent(
    # 2. CRITICAL FIX: Use the 'model' variable we defined above, 
    # otherwise the API key is ignored!
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
    # 3. CRITICAL FIX: 'result_type' was removed from Agent() in newer versions.
    # We must pass it in .run() instead.
    retries=2
)

async def run_decision_agent(input: DecisionInput) -> DecisionOutput:
    # 4. CRITICAL FIX: Pass result_type here to enforce structured output
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
    
    # 5. CRITICAL FIX: Modern versions return the data directly in .data
    return response.data
