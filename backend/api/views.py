from django.shortcuts import render

# Create your views here.
from django.shortcuts import render, HttpResponse
from .models import *
from rest_framework import generics,status
from.serializers import*
from rest_framework.views import APIView
from rest_framework.response import Response
from datetime import datetime

import time


# Create your views here.

class Register(APIView):
    serializer_class = UserRegisterSerializer
    def post(self,request,fromat =None):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():

            username = serializer.data.get('username')
            f_name = serializer.data.get('f_name')
            l_name = serializer.data.get("l_name")
            dob = serializer.data.get("dob")
            password = serializer.data.get('password')
            
            dob_date = datetime.strptime(dob, "%Y-%m-%d")
            today = datetime.today()
            age = today.year - dob_date.year - ((today.month, today.day) < (dob_date.month, dob_date.day))

            if age < 5:
                return Response({"error": "User's age must be at least 5 years old"}, status=status.HTTP_400_BAD_REQUEST)

            queryset = User.objects.filter (username = username)
            if queryset.exists():
                return Response(serializer.errors, status=status.HTTP_226_IM_USED)
            
            else :
                user = User(username=username,f_name=f_name,l_name=l_name,dob=dob,password=password)
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
                user = queryset.first()
                profile_queryset = Profile.objects.filter(u_id = user.u_id)
                if profile_queryset.exists():
                    profiles = profile_queryset
                    return Response({'u_id':user.u_id, "profile": ProfileSerializer(profiles,many = True).data},status=status.HTTP_200_OK)
                else:
                    return Response({'error': 'No Profiles Exisits Currently '},status=status.HTTP_204_NO_CONTENT)            
            else:
                return Response({'error': 'Invalid username or password'},status=status.HTTP_404_NOT_FOUND)
        else:
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
        

class AddProfile(APIView):
    serializer_class = ProfileAddSerializer

    def post(self, request, format = None):
        serializer = self.serializer_class(data = request.data)

        if serializer.is_valid():
            u_id = serializer.data.get('u_id')
            p_name = serializer.data.get('p_name')
            p_dob = serializer.data.get('p_dob')
            dob_date = datetime.strptime(p_dob, "%Y-%m-%d")
            today = datetime.today()
            age = today.year - dob_date.year - ((today.month, today.day) < (dob_date.month, dob_date.day))

            if age < 5:
                return Response({"error": "User's age must be at least 5 years old"}, status=status.HTTP_226_IM_USED)
            queryset = Profile.objects.filter(p_name=p_name,u_id=u_id)
            if queryset.exists():
                return Response({'error' : 'Profile name alredy There ','u_id':u_id},status=status.HTTP_226_IM_USED)
            else:
                profile = Profile(p_name=p_name,u_id = u_id, p_dob = p_dob)
                profile.save()
                return Response({'u_id':u_id,"profile":ProfileSerializer(Profile.objects.filter(u_id=u_id),many = True).data},status=status.HTTP_201_CREATED)         
        else:
            return Response(serializer.errors,status=status.HTTP_406_NOT_ACCEPTABLE)

class DelProfile(APIView):
    serializer_class = ProfileDelSerializer

    def post(self, request, format = None):
        serializer = self.serializer_class(data = request.data)
        if serializer.is_valid():
            u_id = serializer.data.get('u_id')
            p_name = serializer.data.get('p_name')
            if p_name == User.objects.filter(u_id=u_id).first().f_name:
                return Response({'error': 'Main Profile, cannot be deleted'},status=status.HTTP_226_IM_USED)

            del_queryset = Profile.objects.filter(u_id=u_id,p_name=p_name)
            if del_queryset.exists():
                del_queryset.delete()
                return Response({'u_id':u_id,"profile":ProfileSerializer(Profile.objects.filter(u_id=u_id),many = True).data},status=status.HTTP_202_ACCEPTED)
                
            else:
                return Response({'error': 'Profile not found'},status=status.HTTP_404_NOT_FOUND)
                
        else:
            return Response(serializer.errors,status=status.HTTP_406_NOT_ACCEPTABLE)
        
class ConnectBT(APIView):
    def post(self, request, fromat= None):
        try:
            return Response({'success':'Connected'},status=status.HTTP_200_OK)
        except bluetooth.BluetoothError as e:
            return Response({'error': 'Bluetooth Error'},status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION)
        
class DisconnectBT(APIView):
    def post(self, request, fromat= None):
        try:
            return Response({'success':'Disconnected'},status=status.HTTP_200_OK)
        except bluetooth.BluetoothError as e:
            return Response({'error': 'Bluetooth Error'},status=status.HTTP_401_UNAUTHORIZED)


def display(request):
    st=User.objects.all() 
    return render(request,'display.html',{'st':st})

