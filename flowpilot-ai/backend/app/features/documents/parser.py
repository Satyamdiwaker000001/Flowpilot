import fitz  # PyMuPDF
from docx import Document as DocxDocument
import io
import logging

logger = logging.getLogger(__name__)

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extracts text from a PDF file."""
    logger.info("Extracting text from PDF...")
    try:
        pdf_document = fitz.open(stream=file_bytes, filetype="pdf")
        text = ""
        for page_num in range(len(pdf_document)):
            page = pdf_document.load_page(page_num)
            text += page.get_text() + "\n"
        return text.strip()
    except Exception as e:
        logger.error(f"Error extracting PDF: {e}")
        return ""

def extract_text_from_docx(file_bytes: bytes) -> str:
    """Extracts text from a DOCX file."""
    logger.info("Extracting text from DOCX...")
    try:
        doc = DocxDocument(io.BytesIO(file_bytes))
        text = "\n".join([para.text for para in doc.paragraphs])
        return text.strip()
    except Exception as e:
        logger.error(f"Error extracting DOCX: {e}")
        return ""

def parse_document(file_bytes: bytes, mime_type: str) -> str:
    """Parses a document based on its mime type and returns the extracted text."""
    if "pdf" in mime_type.lower():
        return extract_text_from_pdf(file_bytes)
    elif "wordprocessingml.document" in mime_type.lower() or "msword" in mime_type.lower():
        return extract_text_from_docx(file_bytes)
    elif "text/plain" in mime_type.lower() or "csv" in mime_type.lower():
        return file_bytes.decode('utf-8', errors='ignore')
    else:
        logger.warning(f"Unsupported mime type: {mime_type}. Treating as plain text.")
        return file_bytes.decode('utf-8', errors='ignore')
