from django.db import models
import random

def get_id():
    while True:
        id = random.randint(1,10**6 )
        if User.objects.filter(u_id = id).count() == 0:
            break
    
    return id

# Create your models here.
class User(models.Model):
    u_id = models.IntegerField(unique=True,default=get_id)
    username = models.CharField(max_length = 15)
    f_name = models.CharField(max_length = 50)
    l_name = models.CharField(max_length = 50)
    dob = models.DateField(auto_now=False, auto_now_add=False)
    password = models.CharField(max_length = 50)

class Profile(models.Model):
    u_id = models.IntegerField()
    p_id = models.IntegerField(default=get_id,unique=True)
    p_name = models.CharField(max_length = 50)
    p_dob  = models.DateField(auto_now=False, auto_now_add=False)