from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from .serializers import UserSerializer

# Create your views here.

class RegisterUser(APIView):

    serializer_class = UserSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        message_format = {
            "user": serializer.data
        }

        return Response(message_format, status=status.HTTP_201_CREATED)