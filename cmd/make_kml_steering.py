import numpy as np
from scipy import linalg as la
import matplotlib.pyplot as plt


data_file = 'HQL_kml.txt'

#plt.ion()

# training data loading
data = np.loadtxt(data_file, comments='#', delimiter='\t', skiprows=0, usecols=(0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19))
dt_fr = data[:,0] #frame number
dt_fr_mov = data[:,1] #frame number for movie
dt_lon = data[:,2] 
dt_lat = data[:,3]
dt_lon_DB = data[:,4]
dt_lat_DB = data[:,5]

ave_accX = data[:,6]
ave_vel = data[:,8]
ave_br_pdl = data[:,10]
ave_acc_pdl = data[:,12]
ave_steering = data[:,14]
ave_dist_ahead = data[:,16]
ave_vel_ahead = data[:,18]

var_accX = data[:,7]
var_vel = data[:,9]
var_br_pdl = data[:,11]
var_acc_pdl = data[:,13]
var_steering = data[:,15]
var_dist_ahead = data[:,17]
var_vel_ahead = data[:,19]


N = len(dt_fr)

diff_lon = -0.00326
diff_lat = 0.00322   
       
f = open('HQL_sample_steering.kml','w')
f.write('<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n')
f.write('<kml xmlns="http://earth.google.com/kml/2.2">n')
f.write('<Document>\n')
f.write('<Style id="str">\n <IconStyle>\n <scale>0.8</scale>\n <Icon>\n <href>straight.png</href>\n </Icon>\n </IconStyle>\n </Style>\n')
f.write('<Style id="right">\n <IconStyle>\n <scale>0.8</scale>\n <Icon>\n <href>right.png</href>\n </Icon>\n </IconStyle>\n </Style>\n')
f.write('<Style id="left">\n <IconStyle>\n <scale>0.8</scale>\n <Icon>\n <href>left.png</href>\n </Icon>\n </IconStyle>\n </Style>\n')
f.write('\n')


for i in xrange(1,N):
    f.write('<Placemark>\n')
    f.write('<description>frame:'+str(dt_fr[i])+', frame_mov:'+str(dt_fr_mov[i])+
    ', lon:'+str(dt_lon[i])+', lat:'+str(dt_lat[i])+
    ', accX:'+str(ave_accX[i])+
    ', vel:'+str(ave_vel[i])+
    ', br_pdl:'+str(ave_br_pdl[i])+
    ', acc_pdl:'+str(ave_acc_pdl[i])+
    ', steering:'+str(ave_steering[i])+
    ', dist_ahead:'+str(ave_dist_ahead[i])+
    ', vel_ahead:'+str(ave_vel_ahead[i])+
    '</description>\n')
    f.write('<Point>\n <coordinates>')
    f.write(str(dt_lon[i]+diff_lon)+', '+str(dt_lat[i]+diff_lat)+'\n')
    f.write('</coordinates>\n </Point>')
    if ave_steering[i]>10:
        f.write('<styleUrl>left</styleUrl>\n </Placemark>\n')
    elif ave_steering[i]<-10:
        f.write('<styleUrl>right</styleUrl>\n </Placemark>\n')
    else:
        f.write('<styleUrl>str</styleUrl>\n </Placemark>\n')
f.write('</Document>\n </kml>\n')
f.close()

#    f.write('</coordinates>\n </Point>')
#    f.write('<styleUrl>#icon7</styleUrl>\n </Placemark>\n')