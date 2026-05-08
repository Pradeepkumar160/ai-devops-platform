import os
from datetime import datetime


def generate_report(text: str, filename: str = None) -> str:
    """Generate a PDF incident report using reportlab."""
    if filename is None:
        ts = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
        filename = f"incident_report_{ts}.pdf"

    reports_dir = os.path.join(os.path.dirname(__file__), "..", "..", "reports")
    os.makedirs(reports_dir, exist_ok=True)
    filepath = os.path.join(reports_dir, filename)

    try:
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.lib.pagesizes import letter
        from reportlab.lib import colors

        doc = SimpleDocTemplate(filepath, pagesize=letter)
        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            "Title", parent=styles["Heading1"], textColor=colors.HexColor("#1e40af")
        )
        elements = [
            Paragraph("AI DevOps Platform - Incident Report", title_style),
            Spacer(1, 12),
            Paragraph(f"Generated: {datetime.utcnow().isoformat()} UTC", styles["Normal"]),
            Spacer(1, 12),
            Paragraph(text, styles["Normal"]),
        ]
        doc.build(elements)
        return filepath
    except Exception as e:
        return f"Error generating PDF: {str(e)}"
