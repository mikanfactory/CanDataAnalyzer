import numpy as np
from scipy import linalg as la
import matplotlib.pyplot as plt
##import pandas as pd


data_file = '030512B3BQm.csv'
#plt.ion()

# training data loading
data = np.loadtxt(data_file, comments='#', delimiter=',', skiprows=2, usecols=(1,2,15,16,22,23,6,28,34,36,49,50,51))
dt_fr = data[:,0] #frame number
dt_fr_mov = data[:,1] #frame number for movie
dt_lat = data[:,2] # latitude
dt_lng = data[:,3] # longtitude
dt_lat_DB = data[:,4]
dt_lng_DB = data[:,5]

dt_accX = data[:,6]
dt_vel = data[:,7]
dt_br_pdl = data[:,8]
dt_acc_pdl = data[:,9]
dt_steering = data[:,10]
dt_dist_ahead = data[:,11]
dt_vel_ahead = data[:,12]

ave_accX = 0
ave_vel = 0
ave_br_pdl = 0
ave_acc_pdl = 0
ave_steering = 0
ave_dist_ahead = 0
ave_vel_ahead = 0

var_accX = 0
var_vel = 0
var_br_pdl = 0
var_acc_pdl = 0
var_steering = 0
var_dist_ahead = 0
var_vel_ahead = 0

N = len(dt_fr)
# find accel switch grt0 -> 0
flg = 0
#acc_fr = []

interval = 30 #100


f = open('HQL_kml.txt','w')

for i in xrange(1,N):
    ave_accX += dt_accX[i]
    ave_vel += dt_vel[i]
    ave_br_pdl += dt_br_pdl[i]
    ave_acc_pdl += dt_acc_pdl[i]
    ave_steering += dt_steering[i]
    ave_dist_ahead += dt_dist_ahead[i]
    ave_vel_ahead += dt_vel_ahead[i]
    if i%interval==0 :
        ave_accX /= interval
        ave_vel /= interval
        ave_br_pdl /= interval
        ave_acc_pdl /= interval
        ave_steering /= interval
        ave_dist_ahead /= interval
        ave_vel_ahead /= interval
        
        for j in xrange(0,interval):
            var_accX += (dt_accX[i-j]-ave_accX)**2
            var_vel += (dt_vel[i-j]-ave_vel)**2
            var_br_pdl += (dt_br_pdl[i-j]-ave_br_pdl)**2
            var_acc_pdl += (dt_acc_pdl[i-j]-ave_acc_pdl)**2
            var_steering += (dt_steering[i-j]-ave_steering)**2
            var_dist_ahead += (dt_dist_ahead[i-j]-ave_dist_ahead)**2
            var_vel_ahead += (dt_vel_ahead[i-j]-ave_vel_ahead)**2
        
        f.write(str(dt_fr[i])+'\t'
        +str(dt_fr_mov[i])+'\t'
        +str(dt_lng[i])+'\t'
        +str(dt_lat[i])+'\t'
        +str(dt_lng_DB[i])+'\t'
        +str(dt_lat_DB[i])+'\t'
        +str(ave_accX)+'\t'
        +str(var_accX/interval)+'\t'
        +str(ave_vel)+'\t'
        +str(var_vel/interval)+'\t'
        +str(ave_br_pdl)+'\t'
        +str(var_br_pdl/interval)+'\t'
        +str(ave_acc_pdl)+'\t'
        +str(var_acc_pdl/interval)+'\t'
        +str(ave_steering)+'\t'
        +str(var_steering/interval)+'\t'
        +str(ave_dist_ahead)+'\t'
        +str(var_dist_ahead/interval)+'\t'
        +str(ave_vel_ahead)+'\t'
        +str(var_vel_ahead/interval)+'\t'
        +'\n')

        ave_accX = 0
        ave_vel = 0
        ave_br_pdl = 0
        ave_acc_pdl = 0
        ave_steering = 0
        ave_dist_ahead = 0
        ave_vel_ahead = 0
        
        var_accX = 0
        var_vel = 0
        var_br_pdl = 0
        var_acc_pdl = 0
        var_steering = 0
        var_dist_ahead = 0
        var_vel_ahead = 0

f.close()
