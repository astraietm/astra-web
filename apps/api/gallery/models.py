from django.db import models

class GalleryItem(models.Model):
    CATEGORY_CHOICES = [
        ('workshops', 'Workshops'),
        ('ctf', 'CTF'),
        ('seminars', 'Seminars'),
        ('hackathons', 'Hackathons'),
        ('other', 'Other'),
    ]

    title = models.CharField(max_length=200)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='other')
    image_url = models.URLField(max_length=500)
    public_id = models.CharField(max_length=200, blank=True, null=True) # For Cloudinary management
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']
