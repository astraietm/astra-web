from rest_framework import generics, permissions
from .models import GalleryItem
from .serializers import GalleryItemSerializer
from core.permissions import IsAdminUser

class GalleryItemListCreateView(generics.ListCreateAPIView):
    queryset = GalleryItem.objects.all()
    serializer_class = GalleryItemSerializer
    
    def get_permissions(self):
        if self.request.method == 'POST':
            # Only admin can add photos
            return [IsAdminUser()]
        # Anyone can view
        return [permissions.AllowAny()]

class GalleryItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = GalleryItem.objects.all()
    serializer_class = GalleryItemSerializer
    permission_classes = [IsAdminUser]
