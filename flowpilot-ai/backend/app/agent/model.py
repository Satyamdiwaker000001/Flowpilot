import logging
from transformers import pipeline

logger = logging.getLogger(__name__)

class HuggingFaceModelManager:
    def __init__(self):
        self.generator = None
        self.model_name = "Qwen/Qwen2.5-1.5B-Instruct" # Fallback smaller model for quick local dev, production can use Qwen2.5-3B-Instruct or SmolLM2-1.7B-Instruct

    def initialize(self):
        if self.generator is None:
            logger.info(f"Initializing HF Pipeline with {self.model_name}...")
            # For local dev without GPU, this might be slow, consider passing device=-1 or device=0
            # Keeping it simple for architecture setup
            self.generator = pipeline(
                "text-generation",
                model=self.model_name
            )

    def generate_response(self, prompt: str, max_new_tokens: int = 256) -> str:
        if not self.generator:
            # Mock response for fast dev if not initialized properly
            return f"Mock response from HF model for prompt: {prompt[:20]}..."
            
        result = self.generator(prompt, max_new_tokens=max_new_tokens, return_full_text=False)
        return result[0]["generated_text"].strip()

# Singleton instance
hf_manager = HuggingFaceModelManager()
