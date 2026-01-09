from django.urls import path
from .views import GalleryItemListCreateView, GalleryItemDetailView

urlpatterns = [
    path('', GalleryItemListCreateView.as_view(), name='gallery-list-create'),
    path('<int:pk>/', GalleryItemDetailView.as_view(), name='gallery-detail'),
]
