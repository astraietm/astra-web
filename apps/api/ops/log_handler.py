import logging
from django.db import DatabaseError

class DBLogHandler(logging.Handler):
    """
    Custom Django logging handler that persists log messages directly into the AuditLog table in the DB.
    """
    def emit(self, record):
        # Prevent infinite recursion when logging database operations
        if record.name.startswith('django.db'):
            return

        try:
            from .models import AuditLog
            msg = self.format(record)
            
            level_map = {
                'DEBUG': 'INFO',
                'INFO': 'INFO',
                'WARNING': 'WARN',
                'WARN': 'WARN',
                'ERROR': 'ERROR',
                'CRITICAL': 'ERROR'
            }
            level = level_map.get(record.levelname, 'INFO')

            action = f"Django [{record.name}]"
            if len(action) > 250:
                action = action[:250]

            AuditLog.objects.create(
                action=action,
                details=msg,
                level=level
            )
        except (DatabaseError, Exception):
            pass
