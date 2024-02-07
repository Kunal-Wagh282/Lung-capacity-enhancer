from django.shortcuts import render

# Create your views here.
from django.shortcuts import render, HttpResponse
from .models import *
from rest_framework import generics,status
from.serializers import*
from rest_framework.views import APIView
from rest_framework.response import Response

# Create your views here.

class Register(APIView):
    serializer_class = UserRegisterSerializer
    def post(self,request,fromat =None):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            users_to_update = User.objects.filter(session_id=self.request.session.session_key)
            users_to_update.update(session_id='')
            user = queryset.first()
            if not self.request.session.exists(self.request.session.session_key):
                    self.request.session.create()  
            session_id = self.request.session.session_key
            username = serializer.data.get('username')
            f_name = serializer.data.get('f_name')
            l_name = serializer.data.get("l_name")
            dob = serializer.data.get("dob")
            password = serializer.data.get('password')
            queryset = User.objects.filter (username = username)
            if queryset.exists():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            else :
                user = User(session_id=session_id,username=username,f_name=f_name,l_name=l_name,dob=dob,password=password)
                user.save()
                profile = Profile(u_id = user.u_id,p_name = f_name, p_dob = dob)
                profile.save()

                return Response(UserRegisterSerializer(user).data,status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            

class Login(APIView):
    serializer_class = UserLoginSerializer

    def post(self,request,format =None):

        serializer = self.serializer_class(data = request.data)

        if serializer.is_valid():
            username = serializer.data.get('username')
            password = serializer.data.get('password')
            queryset = User.objects.filter(username= username,password = password)
            if queryset.exists():
                if not self.request.session.exists(self.request.session.session_key):
                    self.request.session.create()   
                users_to_update = User.objects.filter(session_id=self.request.session.session_key)
                users_to_update.update(session_id='')
                user = queryset.first()
                if user.session_id != self.request.session.session_key:
                    user.session_id = self.request.session.session_key
                    user.save(update_fields=['session_id'])
                profile_queryset = Profile.objects.filter(u_id = user.u_id)

                if profile_queryset.exists():
                    profiles = profile_queryset
                    return Response(ProfileSerializer(profiles,many = True).data,status=status.HTTP_200_OK)
                else:
                    return Response({'error': 'Profile not found'},status=status.HTTP_204_NO_CONTENT)            
            else:
                return Response({'error': 'Invalid username or password'},status=status.HTTP_404_NOT_FOUND)
        else:
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
        

class AddProfile(APIView):
    serializer_class = ProfileSerializer

    def post(self, request, format = None):
        serializer = self.serializer_class(data = request.data)
        if serializer.is_valid():
            p_name = serializer.data.get('p_name')
            p_dob = serializer.data.get('p_dob')
            queryset = User.objects.filter(session_id = self.request.session.session_key)

            if not queryset.exists():
                return Response({'error':'sessionauth failed, try loging in again'},status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION)
            else:
                u_id = User.objects.filter(session_id = self.request.session.session_key).first().u_id
                profile = Profile(p_name=p_name,u_id = u_id, p_dob = p_dob)
                profile.save()
                return Response(ProfileSerializer(Profile.objects.filter(u_id=u_id),many = True).data,status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors,status=status.HTTP_406_NOT_ACCEPTABLE)


def display(request):
    st=User.objects.all() # Collect all records from table 
    return render(request,'display.html',{'st':st})

