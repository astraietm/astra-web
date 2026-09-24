"""
Server-side ticket pass image generator using Pillow.
Produces a PNG that mirrors the frontend TicketPass component design:
dark header, event details grid, registrant info, QR code stub, footer.
"""

import io
import qrcode
from PIL import Image, ImageDraw, ImageFont
from datetime import datetime
import logging
import os

logger = logging.getLogger(__name__)

# ── Colour palette (matching frontend) ──────────────────────────────────
BG_WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
TH_YELLOW = (250, 204, 21)  # Tailwind yellow-400
TH_LIME = (163, 230, 53)    # Tailwind lime-400
GRAY_50 = (249, 250, 251)
GRAY_100 = (243, 244, 246)
GRAY_200 = (229, 231, 235)
GRAY_400 = (156, 163, 175)
GRAY_500 = (107, 114, 128)
GRAY_600 = (75, 85, 99)
GRAY_700 = (55, 65, 81)
TEXT_BLACK = (17, 24, 39)

# ── Dimensions ──────────────────────────────────────────────────────────
TICKET_WIDTH = 680
BORDER = 4
HEADER_H = 56
FOOTER_H = 32

# Column widths (2:1 split like the frontend)
LEFT_COL_W = int((TICKET_WIDTH - BORDER * 2 - BORDER) * 0.65)  # ~65%
RIGHT_COL_W = TICKET_WIDTH - BORDER * 2 - BORDER - LEFT_COL_W

# Font sizes
FONT_DIR = os.path.join(os.path.dirname(__file__), 'fonts')


def _get_font(size, bold=False):
    """
    Try to load a monospace / sans-serif font.
    Falls back to Pillow's default bitmap font if nothing is available.
    """
    font_names = []
    if bold:
        font_names = [
            os.path.join(FONT_DIR, 'Inter-Bold.ttf'),
            '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
            '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf',
            '/usr/share/fonts/truetype/freefont/FreeSansBold.ttf',
        ]
    else:
        font_names = [
            os.path.join(FONT_DIR, 'Inter-Regular.ttf'),
            '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
            '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf',
            '/usr/share/fonts/truetype/freefont/FreeSans.ttf',
        ]
    for name in font_names:
        try:
            return ImageFont.truetype(name, size)
        except (OSError, IOError):
            continue
    return ImageFont.load_default()


def _get_mono_font(size, bold=False):
    """Try to load a monospace font."""
    font_names = []
    if bold:
        font_names = [
            os.path.join(FONT_DIR, 'JetBrainsMono-Bold.ttf'),
            '/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf',
            '/usr/share/fonts/truetype/liberation/LiberationMono-Bold.ttf',
            '/usr/share/fonts/truetype/freefont/FreeMonoBold.ttf',
        ]
    else:
        font_names = [
            os.path.join(FONT_DIR, 'JetBrainsMono-Regular.ttf'),
            '/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf',
            '/usr/share/fonts/truetype/liberation/LiberationMono-Regular.ttf',
            '/usr/share/fonts/truetype/freefont/FreeMono.ttf',
        ]
    for name in font_names:
        try:
            return ImageFont.truetype(name, size)
        except (OSError, IOError):
            continue
    return ImageFont.load_default()


def _generate_qr_image(token, size=160):
    """Generate a QR code image for the verification URL."""
    base_url = "https://astraietm.in/verify"
    data = f"{base_url}/{token}"

    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=8,
        border=2,
    )
    qr.add_data(data)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white").convert('RGB')
    img = img.resize((size, size), Image.LANCZOS)
    return img


def _truncate_text(draw, text, font, max_width):
    """Truncate text with ellipsis if it exceeds max_width."""
    if not text:
        return ""
    bbox = draw.textbbox((0, 0), text, font=font)
    if (bbox[2] - bbox[0]) <= max_width:
        return text
    while len(text) > 3:
        text = text[:-1]
        bbox = draw.textbbox((0, 0), text + "...", font=font)
        if (bbox[2] - bbox[0]) <= max_width:
            return text + "..."
    return text[:3] + "..."


def generate_ticket_png(registration):
    """
    Generate a ticket pass PNG for the given Registration instance.
    Returns PNG bytes (io.BytesIO content).
    """
    user = registration.user
    event = registration.event

    # ── Extract data ────────────────────────────────────────────────────
    name = user.full_name or user.email
    email = user.email
    phone = registration.phone_number or getattr(user, 'phone_number', '') or 'N/A'
    college = registration.college or getattr(user, 'college', '') or 'N/A'
    dept = registration.department or 'N/A'
    year = registration.year_of_study or 'N/A'
    reg_id = str(registration.id).zfill(4)
    status = registration.status or 'REGISTERED'
    token = registration.token or ''
    team_name = registration.team_name or ''
    team_members = registration.team_members or ''

    event_title = event.title or 'ASTRA Event'
    category = getattr(event, 'category', '') or 'EVENT'
    venue = event.venue or 'Main Campus'
    event_time = getattr(event, 'time', '') or '10:00 AM'

    if event.event_date:
        formatted_date = event.event_date.strftime('%a, %d %b, %Y')
    else:
        formatted_date = 'TBA'

    gen_date = datetime.now().strftime('%d/%m/%Y')
    timestamp = registration.timestamp.strftime('%d/%m/%Y') if registration.timestamp else gen_date

    # ── Fonts ───────────────────────────────────────────────────────────
    font_title = _get_font(22, bold=True)
    font_heading = _get_font(14, bold=True)
    font_body = _get_font(13)
    font_body_bold = _get_font(13, bold=True)
    font_small = _get_font(11)
    font_small_bold = _get_font(11, bold=True)
    font_tiny = _get_font(9)
    font_tiny_bold = _get_font(9, bold=True)
    font_mono = _get_mono_font(10)
    font_mono_bold = _get_mono_font(10, bold=True)
    font_mono_tiny = _get_mono_font(8)

    # ── Calculate left column height ────────────────────────────────────
    # We need to measure content to determine total height
    # Estimate: header area ~200px, registrant area ~160px, team ~60px
    left_content_h = 40  # top padding
    left_content_h += 20  # category badge
    left_content_h += 30  # title
    left_content_h += 20  # spacing
    left_content_h += 100  # event specs grid
    left_content_h += 20  # spacing
    left_content_h += 20  # "REGISTRANT DETAILS" label
    left_content_h += 25  # name
    left_content_h += 18  # email
    left_content_h += 20  # spacing
    left_content_h += 50  # phone + year row
    left_content_h += 35  # college & dept
    if team_name:
        left_content_h += 60  # team info box
    left_content_h += 20  # bottom padding

    # Right column: QR code section
    qr_size = 160
    right_content_h = 40 + 20 + qr_size + 20 + 60 + 40  # padding + label + qr + spacing + token + padding

    body_h = max(left_content_h, right_content_h)

    total_h = HEADER_H + BORDER + body_h + FOOTER_H + BORDER * 2

    # ── Create canvas ───────────────────────────────────────────────────
    img = Image.new('RGB', (TICKET_WIDTH, total_h), BLACK)
    draw = ImageDraw.Draw(img)

    # Inner white background (inside border)
    draw.rectangle(
        [BORDER, BORDER, TICKET_WIDTH - BORDER - 1, total_h - BORDER - 1],
        fill=BG_WHITE
    )

    # ━━ HEADER BAR (black) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    header_y = BORDER
    draw.rectangle(
        [BORDER, header_y, TICKET_WIDTH - BORDER - 1, header_y + HEADER_H],
        fill=BLACK
    )

    # Yellow "A" box
    a_box_x = BORDER + 16
    a_box_y = header_y + 12
    a_box_size = 32
    draw.rectangle(
        [a_box_x, a_box_y, a_box_x + a_box_size, a_box_y + a_box_size],
        fill=TH_YELLOW
    )
    a_font = _get_font(18, bold=True)
    draw.text((a_box_x + 10, a_box_y + 5), "A", fill=BLACK, font=a_font)

    # "ASTRA IETM 2026" + "OFFICIAL EVENT TICKET PASS"
    text_x = a_box_x + a_box_size + 12
    draw.text((text_x, header_y + 12), "ASTRA IETM 2026", fill=TH_YELLOW, font=font_tiny_bold)
    draw.text((text_x, header_y + 25), "OFFICIAL EVENT TICKET PASS", fill=BG_WHITE, font=font_small_bold)

    # Status badge (right side)
    status_color = TH_LIME if status == 'ATTENDED' else TH_YELLOW if status == 'REGISTERED' else GRAY_400
    status_text = status
    st_bbox = draw.textbbox((0, 0), status_text, font=font_tiny_bold)
    st_w = st_bbox[2] - st_bbox[0]
    st_pad = 8
    st_x = TICKET_WIDTH - BORDER - 16 - 60 - 12 - st_w - st_pad * 2
    st_y = header_y + 16
    draw.rectangle(
        [st_x, st_y, st_x + st_w + st_pad * 2, st_y + 22],
        fill=status_color
    )
    draw.text((st_x + st_pad, st_y + 5), status_text, fill=BLACK, font=font_tiny_bold)

    # Registration ID badge
    id_text = f"#{reg_id}"
    id_bbox = draw.textbbox((0, 0), id_text, font=font_mono_bold)
    id_w = id_bbox[2] - id_bbox[0]
    id_x = TICKET_WIDTH - BORDER - 16 - id_w - 16
    id_y = header_y + 16
    draw.rectangle(
        [id_x, id_y, id_x + id_w + 16, id_y + 22],
        fill=(40, 40, 40), outline=(100, 100, 100)
    )
    draw.text((id_x + 8, id_y + 5), id_text, fill=BG_WHITE, font=font_mono_bold)

    # ━━ BODY AREA ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    body_y = header_y + HEADER_H + BORDER
    left_x = BORDER
    right_x = BORDER + LEFT_COL_W + BORDER

    # Divider line between left and right columns
    draw.rectangle(
        [right_x - BORDER, body_y, right_x - 1, body_y + body_h],
        fill=BLACK
    )

    # Right column background
    draw.rectangle(
        [right_x, body_y, TICKET_WIDTH - BORDER - 1, body_y + body_h],
        fill=GRAY_50
    )

    # ── LEFT COLUMN ─────────────────────────────────────────────────────
    cx = left_x + 24  # content x with padding
    cy = body_y + 20   # content y start
    left_max_w = LEFT_COL_W - 48  # available text width

    # Category badge
    cat_text = category.upper()
    cat_bbox = draw.textbbox((0, 0), cat_text, font=font_tiny_bold)
    cat_w = cat_bbox[2] - cat_bbox[0]
    draw.rectangle([cx, cy, cx + cat_w + 12, cy + 16], fill=BLACK)
    draw.text((cx + 6, cy + 3), cat_text, fill=BG_WHITE, font=font_tiny_bold)
    cy += 22

    # Event title
    title_text = _truncate_text(draw, event_title.upper(), font_title, left_max_w)
    draw.text((cx, cy), title_text, fill=TEXT_BLACK, font=font_title)
    cy += 34

    # ── Event specs grid (date, time, venue) ────────────────────────────
    grid_y = cy
    grid_pad = 12
    grid_h = 90
    draw.rectangle(
        [cx, grid_y, cx + left_max_w, grid_y + grid_h],
        fill=GRAY_100, outline=BLACK, width=2
    )

    # Date
    spec_x = cx + grid_pad
    spec_y = grid_y + grid_pad
    draw.text((spec_x, spec_y), "DATE", fill=GRAY_500, font=font_tiny_bold)
    draw.text((spec_x, spec_y + 13), formatted_date, fill=TEXT_BLACK, font=font_body_bold)

    # Time
    time_x = cx + left_max_w // 2
    draw.text((time_x, spec_y), "TIME", fill=GRAY_500, font=font_tiny_bold)
    draw.text((time_x, spec_y + 13), event_time, fill=TEXT_BLACK, font=font_body_bold)

    # Venue (full width, with separator)
    venue_y = spec_y + 36
    draw.line([(cx + grid_pad, venue_y - 4), (cx + left_max_w - grid_pad, venue_y - 4)], fill=GRAY_200, width=1)
    draw.text((spec_x, venue_y), "VENUE", fill=GRAY_500, font=font_tiny_bold)
    venue_text = _truncate_text(draw, venue, font_body_bold, left_max_w - grid_pad * 2)
    draw.text((spec_x, venue_y + 13), venue_text, fill=TEXT_BLACK, font=font_body_bold)

    cy = grid_y + grid_h + 16

    # ── Registrant details ──────────────────────────────────────────────
    # Dashed separator (simulate with dots)
    draw.text((cx, cy), "REGISTRANT DETAILS", fill=GRAY_500, font=font_tiny_bold)
    cy += 16

    # Name
    name_text = _truncate_text(draw, name, font_heading, left_max_w - 24)
    draw.text((cx + 4, cy), "👤", fill=TEXT_BLACK, font=font_body)
    draw.text((cx + 22, cy), name_text, fill=TEXT_BLACK, font=font_heading)
    cy += 22

    # Email
    email_text = _truncate_text(draw, email, font_small, left_max_w - 30)
    draw.text((cx + 22, cy), email_text, fill=GRAY_600, font=font_small)
    cy += 22

    # Phone + Year row
    draw.text((cx, cy), "CONTACT PHONE", fill=GRAY_500, font=font_tiny)
    draw.text((cx, cy + 12), phone, fill=TEXT_BLACK, font=font_small_bold)

    mid_x = cx + left_max_w // 2
    draw.text((mid_x, cy), "YEAR OF STUDY", fill=GRAY_500, font=font_tiny)
    draw.text((mid_x, cy + 12), year, fill=TEXT_BLACK, font=font_small_bold)
    cy += 32

    # College & Dept
    draw.text((cx, cy), "COLLEGE & DEPT", fill=GRAY_500, font=font_tiny)
    college_dept = college
    if dept and dept != 'N/A':
        college_dept += f" ({dept})"
    college_text = _truncate_text(draw, college_dept, font_small_bold, left_max_w)
    draw.text((cx, cy + 12), college_text, fill=TEXT_BLACK, font=font_small_bold)
    cy += 32

    # Team info (if applicable)
    if team_name:
        team_box_y = cy
        team_box_h = 50 if team_members else 30
        # Yellow-tinted background
        draw.rectangle(
            [cx, team_box_y, cx + left_max_w, team_box_y + team_box_h],
            fill=(254, 249, 195), outline=BLACK, width=2  # yellow-100
        )
        team_label = f"TEAM: {team_name}"
        team_label = _truncate_text(draw, team_label, font_small_bold, left_max_w - 20)
        draw.text((cx + 10, team_box_y + 8), team_label, fill=TEXT_BLACK, font=font_small_bold)
        if team_members:
            members_text = f"Members: {team_members}"
            members_text = _truncate_text(draw, members_text, font_tiny, left_max_w - 30)
            draw.text((cx + 20, team_box_y + 28), members_text, fill=GRAY_700, font=font_tiny)

    # ── RIGHT COLUMN (QR code stub) ────────────────────────────────────
    rcx = right_x + (RIGHT_COL_W // 2)  # center x of right column
    rcy = body_y + 24

    # "SCAN FOR ENTRY" badge
    scan_text = "SCAN FOR ENTRY"
    scan_bbox = draw.textbbox((0, 0), scan_text, font=font_tiny_bold)
    scan_w = scan_bbox[2] - scan_bbox[0]
    scan_bx = rcx - (scan_w + 12) // 2
    draw.rectangle([scan_bx, rcy, scan_bx + scan_w + 12, rcy + 16], fill=BLACK)
    draw.text((scan_bx + 6, rcy + 3), scan_text, fill=BG_WHITE, font=font_tiny_bold)
    rcy += 28

    # QR Code
    qr_img = _generate_qr_image(token, size=qr_size)
    qr_x = rcx - qr_size // 2
    # QR border/shadow
    draw.rectangle(
        [qr_x - 4, rcy - 4, qr_x + qr_size + 4, rcy + qr_size + 4],
        fill=BG_WHITE, outline=BLACK, width=2
    )
    # Shadow effect
    draw.rectangle(
        [qr_x - 1, rcy + qr_size + 5, qr_x + qr_size + 7, rcy + qr_size + 8],
        fill=BLACK
    )
    draw.rectangle(
        [qr_x + qr_size + 5, rcy - 1, qr_x + qr_size + 8, rcy + qr_size + 5],
        fill=BLACK
    )
    img.paste(qr_img, (qr_x, rcy))
    rcy += qr_size + 20

    # Token ID section
    draw.text(
        (rcx - draw.textbbox((0, 0), "TICKET TOKEN ID", font=font_mono_tiny)[2] // 2, rcy),
        "TICKET TOKEN ID", fill=GRAY_500, font=font_mono_tiny
    )
    rcy += 14

    token_display = token[:16] + "..." if len(token) > 16 else token
    t_bbox = draw.textbbox((0, 0), token_display, font=font_mono)
    t_w = t_bbox[2] - t_bbox[0]
    t_x = rcx - (t_w + 12) // 2
    draw.rectangle([t_x, rcy, t_x + t_w + 12, rcy + 18], fill=BG_WHITE, outline=BLACK, width=1)
    draw.text((t_x + 6, rcy + 3), token_display, fill=TEXT_BLACK, font=font_mono)
    rcy += 26

    # "Present this QR code..." text
    hint_text = "Present this QR code at the"
    hint2_text = "event check-in desk."
    h_bbox = draw.textbbox((0, 0), hint_text, font=font_mono_tiny)
    draw.text((rcx - (h_bbox[2] - h_bbox[0]) // 2, rcy), hint_text, fill=GRAY_400, font=font_mono_tiny)
    rcy += 12
    h2_bbox = draw.textbbox((0, 0), hint2_text, font=font_mono_tiny)
    draw.text((rcx - (h2_bbox[2] - h2_bbox[0]) // 2, rcy), hint2_text, fill=GRAY_400, font=font_mono_tiny)

    # ━━ FOOTER BAR ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    footer_y = body_y + body_h
    # Footer separator
    draw.rectangle(
        [BORDER, footer_y, TICKET_WIDTH - BORDER - 1, footer_y + 2],
        fill=BLACK
    )
    # Footer background
    draw.rectangle(
        [BORDER, footer_y + 2, TICKET_WIDTH - BORDER - 1, total_h - BORDER - 1],
        fill=GRAY_100
    )

    f_pad = 20
    draw.text(
        (BORDER + f_pad, footer_y + 10),
        f"GEN_DATE: {timestamp}",
        fill=GRAY_500, font=font_mono_tiny
    )
    footer_right = "ASTRA IETM SECURE TICKET VERIFICATION SYSTEM"
    fr_bbox = draw.textbbox((0, 0), footer_right, font=font_mono_tiny)
    draw.text(
        (TICKET_WIDTH - BORDER - f_pad - (fr_bbox[2] - fr_bbox[0]), footer_y + 10),
        footer_right,
        fill=TEXT_BLACK, font=font_mono_bold
    )

    # ── Export ──────────────────────────────────────────────────────────
    buffer = io.BytesIO()
    img.save(buffer, format='PNG', optimize=True)
    buffer.seek(0)
    return buffer.getvalue()
