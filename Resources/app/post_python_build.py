import subprocess
rawout=subprocess.check_output(['otool', '-L', '../../MacOS/squwbs_pro']).splitlines()
source=[]
to=[]
for i in range(len(rawout)):
    if(i>0):
        source.append(str(rawout[i]).split(' ')[0][4:])
for i in range(len(source)):
    #Disable System Integrity Protection (rootless) in Mac OS X for the following command to work
    to.append('../../Frameworks/'+source[i].split('/')[-1]) 
    subprocess.Popen(['cp',source[i],to[i]])
for i in range(len(source)):
    subprocess.Popen(['install_name_tool','-change',source[i],'@executable_path'+to[i],'../../MacOS/squwbs_pro'])
