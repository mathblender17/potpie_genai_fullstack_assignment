from pydantic_ai_slim import Agent
from models import DecisionInput, DecisionOutput
import os

# MODEL ALT :-
#model="openrouter:qwen/qwen-2.5-7b-instruct" 

agent = Agent(
    model="openrouter:meta-llama/llama-3.1-8b-instruct",
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
    result_type=DecisionOutput,
    retries=2
)

async def run_decision_agent(input: DecisionInput) -> DecisionOutput:
    response = await agent.run(
        f"""
Decision: {input.decision}

Options:
{chr(10).join(f"- {o}" for o in input.options)}

Constraints:
{input.constraints or "None"}

Urgency: {input.urgency}
"""
    )
    return response.data
