import tiktoken

def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50, encoding_name: str = "cl100k_base") -> list[str]:
    """
    Splits text into chunks using tiktoken.
    """
    if not text:
        return []
        
    encoding = tiktoken.get_encoding(encoding_name)
    tokens = encoding.encode(text)
    
    chunks = []
    start = 0
    while start < len(tokens):
        end = min(start + chunk_size, len(tokens))
        chunk_tokens = tokens[start:end]
        chunk_text = encoding.decode(chunk_tokens)
        chunks.append(chunk_text)
        start += chunk_size - overlap
        
    return chunks
